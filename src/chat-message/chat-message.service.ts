import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatMessage } from 'src/common/entities/chat-message.entity';
import { ChatRoom } from 'src/common/entities/chat-room.entity';
import { CreateMatchingReqeust } from 'src/matching/dto/matching.request';
import { QueryRunner, Repository } from 'typeorm';

@Injectable()
export class ChatMessageService {
  constructor(
    @InjectRepository(ChatMessage)
    private readonly chatMessageRepository: Repository<ChatMessage>,
  ) {}

  async createChatMessage(
    queryRunner: QueryRunner,
    chatRoom: ChatRoom,
    body: CreateMatchingReqeust,
  ): Promise<ChatMessage> {
    return queryRunner.manager.save(ChatMessage, {
      chatRoom: chatRoom,
      fromUser: { id: body.requesterId },
      toUser: { id: body.targetId },
      content: body.message,
    });
  }
}
