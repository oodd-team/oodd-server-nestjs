import { Injectable } from '@nestjs/common';
import { ChatMessage } from 'src/common/entities/chat-message.entity';
import { ChatRoom } from 'src/common/entities/chat-room.entity';
import { CreateMatchingReqeust } from 'src/matching/dto/matching.request';
import { Repository } from 'typeorm';

@Injectable()
export class ChatMessageService {
  constructor(
    private readonly chatMessageRepository: Repository<ChatMessage>,
  ) {}

  async createChatMessage(
    chatRoom: ChatRoom,
    body: CreateMatchingReqeust,
  ): Promise<ChatMessage> {
    return this.chatMessageRepository.save({
      chatRoom: chatRoom,
      fromUser: { id: body.requesterId },
      toUser: { id: body.targetId },
      content: body.message,
    });
  }
}
