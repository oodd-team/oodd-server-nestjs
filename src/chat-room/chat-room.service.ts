import { Injectable } from '@nestjs/common';
import { ChatRoom } from 'src/common/entities/chat-room.entity';
import { Matching } from 'src/common/entities/matching.entity';
import { CreateMatchingReqeust } from 'src/matching/dto/matching.request';
import { Repository } from 'typeorm';

@Injectable()
export class ChatRoomService {
  constructor(private readonly chatRoomRepository: Repository<ChatRoom>) {}

  async createChatRoom(
    matching: Matching,
    body: CreateMatchingReqeust,
  ): Promise<ChatRoom> {
    // 채팅방 생성 로직
    return await this.chatRoomRepository.save({
      fromUser: { id: body.requesterId },
      toUser: { id: body.targetId },
      matching: matching,
      requestStatus: 'pending',
    });
  }
}
