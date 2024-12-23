import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatRoom } from 'src/common/entities/chat-room.entity';
import { Matching } from 'src/common/entities/matching.entity';
import { StatusEnum } from 'src/common/enum/entityStatus';
import { DataNotFoundException } from 'src/common/exception/service.exception';
import { CreateMatchingReqeust } from 'src/matching/dto/matching.request';
import { Repository, QueryRunner } from 'typeorm';

@Injectable()
export class ChatRoomService {
  constructor(
    @InjectRepository(ChatRoom)
    private readonly chatRoomRepository: Repository<ChatRoom>,
  ) {}

  async getChatRoomsWithLatestMessage(userId: number) {
    const chatRooms = await this.chatRoomRepository
      .createQueryBuilder('chatRoom')
      .leftJoinAndSelect('chatRoom.fromUser', 'fromUser')
      .leftJoinAndSelect('chatRoom.toUser', 'toUser')
      .leftJoinAndSelect('chatRoom.chatMessages', 'chatMessages')
      .where('chatRoom.fromUserId = :userId OR chatRoom.toUserId = :userId', {
        userId,
      })
      .andWhere('chatRoom.status = :status', { status: 'activated' })
      .andWhere('chatRoom.requestStatus = :requestStatus', {
        requestStatus: 'accepted',
      })
      .orderBy('chatMessages.createdAt', 'DESC')
      .getMany();

    // 각 채팅방에서 최신 메시지를 선택
    const chatRoomsWithLatestMessages = chatRooms.map((room) => {
      const otherUser =
        room.fromUser.id === userId ? room.toUser : room.fromUser;
      const latestMessage =
        room.chatMessages.length > 0 ? room.chatMessages[0] : null; // 가장 최근 메시지 선택

      return {
        chatRoomId: room.id,
        otherUser: {
          id: otherUser.id,
          nickname: otherUser.nickname,
          profileUrl: otherUser.profilePictureUrl,
        },
        latestMessage: latestMessage,
      };
    });
    return chatRoomsWithLatestMessages;
  }

  async createChatRoom(
    queryRunner: QueryRunner,
    matching: Matching,
    body: CreateMatchingReqeust,
  ): Promise<ChatRoom> {
    // 채팅방 생성 로직
    return await queryRunner.manager.save(ChatRoom, {
      fromUser: { id: body.requesterId },
      toUser: { id: body.targetId },
      matching: matching,
      requestStatus: 'pending',
    });
  }

  async deleteChatRoom(chatRoomId: number, userId: number): Promise<void> {
    const chatRoom = await this.chatRoomRepository.findOne({
      where: { id: chatRoomId },
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
