import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatRoom } from 'src/common/entities/chat-room.entity';
import { Matching } from 'src/common/entities/matching.entity';
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
      .loadRelationIdAndMap('chatRoom.latestMessage', 'chatMessages')
      .where('chatRoom.fromUserId = :userId OR chatRoom.toUserId = :userId', {
        userId,
      })
      .andWhere('chatRoom.status = :status', { status: 'activated' })
      .orderBy('chatMessages.createdAt', 'DESC') // 최신 메시지 우선 정렬
      .getMany();

    return chatRooms.map((chatRoom) => {
      // 상대방 정보 설정
      const otherUser =
        chatRoom.fromUser.id === userId ? chatRoom.toUser : chatRoom.fromUser;

      // 최신 메시지 설정
      const latestMessage = chatRoom.chatMessages[0];

      return {
        chatRoomId: chatRoom.id,
        otherUser: {
          id: otherUser.id,
          nickname: otherUser.nickname,
          profileUrl: otherUser.profilePictureUrl,
        },
        latestMessage: latestMessage
          ? {
              content: latestMessage.content,
              createdAt: latestMessage.createdAt,
            }
          : null,
      };
    });
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
}
