import { Injectable } from '@nestjs/common';
import { CreateMatchingReqeust } from './dto/matching.request';
import { DataSource, Repository } from 'typeorm';
import { Matching } from 'src/common/entities/matching.entity';
import { ChatRoomService } from '../chat-room/chat-room.service';
import { InternalServerException } from 'src/common/exception/service.exception';
import { ChatMessageService } from 'src/chat-message/chat-message.service';
import { ChatRoom } from 'src/common/entities/chat-room.entity';

@Injectable()
export class MatchingService {
  constructor(
    private readonly matchingRepository: Repository<Matching>,
    private readonly chatRoomService: ChatRoomService,
    private readonly chatMessageService: ChatMessageService,
    private readonly dataSource: DataSource,
  ) {}

  async createMatching(body: CreateMatchingReqeust): Promise<ChatRoom> {
    let matching, chatRoom;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      matching = await this.matchingRepository.save({
        requester: { id: body.requesterId },
        target: { id: body.targetId },
      });

      chatRoom = await this.chatRoomService.createChatRoom(matching, body);

      await this.chatMessageService.createChatMessage(chatRoom, body);
      await queryRunner.commitTransaction();

      return chatRoom;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw InternalServerException(error.message);
    } finally {
      await queryRunner.release();
    }
  }
}
