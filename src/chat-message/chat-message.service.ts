import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatMessage } from 'src/common/entities/chat-message.entity';
import { ChatRoom } from 'src/common/entities/chat-room.entity';
import { StatusEnum } from 'src/common/enum/entityStatus';
import { CreateMatchingRequest } from 'src/matching/dto/matching.request';
import { QueryRunner, Repository } from 'typeorm';

@Injectable()
export class ChatMessageService {
  constructor(
    @InjectRepository(ChatMessage)
    private readonly chatMessageRepository: Repository<ChatMessage>,
  ) {}

  async saveMessage(
    chatRoomId: number,
    toUserId: number,
    content: string,
    fromUserId: number,
    createdAt: string,
  ) {
    const newMessage = await this.chatMessageRepository.save({
      chatRoom: { id: chatRoomId },
      toUser: { id: toUserId },
      content: content,
      fromUser: { id: fromUserId },
      createdAt: createdAt,
    });

    const newMessageWithUser = await this.chatMessageRepository.findOne({
      where: { id: newMessage.id },
      relations: ['fromUser', 'toUser'],
    });
    return {
      id: newMessageWithUser.id,
      chatRoomId: chatRoomId,
      content: content,
      fromUser: {
        id: fromUserId,
        nickname: newMessageWithUser.fromUser.nickname,
        profilePictureUrl: newMessageWithUser.fromUser.profilePictureUrl,
      },
      toUser: {
        id: toUserId,
        nickname: newMessageWithUser.toUser.nickname,
        profilePictureUrl: newMessageWithUser.toUser.profilePictureUrl,
      },
      createdAt: createdAt,
      toUserReadAt: newMessageWithUser.toUserReadAt,
    };
  }

  async getMessagesByChatRoomId(chatRoomId: number) {
    const messages = await this.chatMessageRepository.find({
      where: { chatRoom: { id: chatRoomId }, status: StatusEnum.ACTIVATED },
      order: { createdAt: 'ASC' }, // 오래된 메시지부터 최신 메시지 순으로 정렬
      relations: ['fromUser', 'toUser'], // 메시지 발신자, 수신자 정보도 함께 로드
    });

    return messages.map((message) => ({
      id: message.id,
      chatRoomId: chatRoomId,
      content: message.content,
      fromUser: {
        id: message.fromUser.id,
        nickname: message.fromUser.nickname,
        profilePictureUrl: message.fromUser.profilePictureUrl,
      },
      toUser: {
        id: message.toUser.id,
        nickname: message.toUser.nickname,
        profilePictureUrl: message.toUser.profilePictureUrl,
      },
      createdAt: message.createdAt,
      toUserReadAt: message.toUserReadAt,
    }));
  }

  async createChatMessage(
    queryRunner: QueryRunner,
    chatRoom: ChatRoom,
    body: CreateMatchingRequest,
  ): Promise<ChatMessage> {
    return queryRunner.manager.save(ChatMessage, {
      chatRoom: chatRoom,
      fromUser: { id: body.requesterId },
      toUser: { id: body.targetId },
      content: body.message,
    });
  }

  async deleteMessages(chatRoomId: number): Promise<void> {
    const messages = await this.chatMessageRepository.find({
      where: { chatRoom: { id: chatRoomId }, status: StatusEnum.ACTIVATED },
    });

    if (messages.length === 0) {
      return;
    }

    for (const message of messages) {
      message.status = StatusEnum.DEACTIVATED;
      message.softDelete();
    }

    await this.chatMessageRepository.save(messages);
  }
}
