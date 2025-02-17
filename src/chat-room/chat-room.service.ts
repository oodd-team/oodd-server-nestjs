import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatMessageService } from 'src/chat-message/chat-message.service';
import { ChatRoom } from 'src/common/entities/chat-room.entity';
import { Matching } from 'src/common/entities/matching.entity';
import { StatusEnum } from 'src/common/enum/entityStatus';
import { MatchingRequestStatusEnum } from 'src/common/enum/matchingRequestStatus';
import { DataNotFoundException } from 'src/common/exception/service.exception';
import { CreateMatchingRequest } from 'src/matching/dto/matching.request';
import { Repository, QueryRunner } from 'typeorm';

@Injectable()
export class ChatRoomService {
  constructor(
    @InjectRepository(ChatRoom)
    private readonly chatRoomRepository: Repository<ChatRoom>,
    private readonly chatMessageService: ChatMessageService,
  ) {}

  async getChatRoomsWithLatestMessage(userId: number) {
    const chatRooms = await this.chatRoomRepository
      .createQueryBuilder('chatRoom')
      .leftJoinAndSelect('chatRoom.fromUser', 'fromUser')
      .leftJoinAndSelect('chatRoom.toUser', 'toUser')
      .leftJoinAndSelect('chatRoom.chatMessages', 'chatMessages')
      .addSelect([
        'fromUser.id',
        'fromUser.nickname',
        'fromUser.profilePictureUrl',
      ])
      .addSelect(['toUser.id', 'toUser.nickname', 'toUser.profilePictureUrl'])
      .where(
        '(chatRoom.fromUserId = :userId OR chatRoom.toUserId = :userId) AND chatRoom.status = :status AND chatRoom.requestStatus = :requestStatus',
        {
          userId,
          status: StatusEnum.ACTIVATED,
          requestStatus: MatchingRequestStatusEnum.ACCEPTED,
        },
      )
      .orderBy('chatMessages.createdAt', 'DESC')
      .getMany();
    if (!chatRooms || chatRooms.length === 0) {
      return [];
    }

    // 각 채팅방에서 최신 메시지를 선택
    const chatRoomsWithLatestMessages = chatRooms.map((room) => {
      const otherUser =
        room.fromUser && room.fromUser.id === userId
          ? room.toUser
          : room.fromUser;
      // fromUser나 toUser가 null인 경우, otherUser를 빈 객체로 설정
      const otherUserInfo = otherUser
        ? {
            id: otherUser.id,
            nickname: otherUser.nickname,
            profilePictureUrl: otherUser.profilePictureUrl,
          }
        : {};

      const latestMessage =
        room.chatMessages.length > 0 ? room.chatMessages[0] : null; // 가장 최근 메시지 선택

      return {
        id: room.id,
        otherUser: otherUserInfo,
        latestMessage: latestMessage,
      };
    });
    return chatRoomsWithLatestMessages;
  }

  async createChatRoom(
    queryRunner: QueryRunner,
    matching: Matching,
    body: CreateMatchingRequest,
  ): Promise<ChatRoom> {
    // 채팅방 생성 로직
    return await queryRunner.manager.save(ChatRoom, {
      fromUser: { id: body.requesterId },
      toUser: { id: body.targetId },
      matching: matching,
      requestStatus: MatchingRequestStatusEnum.PENDING,
    });
  }

  async deleteChatRoom(chatRoomId: number, userId: number): Promise<void> {
    const chatRoom = await this.chatRoomRepository.findOne({
      where: { id: chatRoomId },
      relations: ['fromUser', 'toUser'],
    });
    if (!chatRoom) {
      throw DataNotFoundException('채팅방을 찾을 수 없습니다.');
    }

    if (chatRoom.fromUser && chatRoom.fromUser.id === userId) {
      chatRoom.fromUserLeavedAt = new Date();
    } else if (chatRoom.toUser && chatRoom.toUser.id === userId) {
      chatRoom.toUserLeavedAt = new Date();
    } else {
      throw DataNotFoundException('채팅방에 해당 사용자가 존재하지 않습니다.');
    }

    // 양쪽 사용자가 모두 나갔을 경우, 채팅방 비활성화
    if (chatRoom.fromUserLeavedAt && chatRoom.toUserLeavedAt) {
      chatRoom.status = StatusEnum.DEACTIVATED;
      chatRoom.softDelete();
      await this.chatMessageService.deleteMessages(chatRoomId);
    }

    await this.chatRoomRepository.save(chatRoom);
  }

  async getChatRoomByMatchingId(matchingId: number): Promise<ChatRoom> {
    return await this.chatRoomRepository.findOne({
      where: {
        matching: { id: matchingId },
      },
      relations: ['matching'],
    });
  }
}
