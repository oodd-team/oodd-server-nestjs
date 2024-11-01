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
