import { Injectable } from '@nestjs/common';
import {
  CreateMatchingReqeust,
  PatchMatchingRequest,
} from './dto/matching.request';
import { DataSource, Repository } from 'typeorm';
import { Matching } from 'src/common/entities/matching.entity';
import { ChatRoomService } from '../chat-room/chat-room.service';
import {
  DataNotFoundException,
  InternalServerException,
} from 'src/common/exception/service.exception';
import { ChatMessageService } from 'src/chat-message/chat-message.service';
import { ChatRoom } from 'src/common/entities/chat-room.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { GetMatchingsResponse } from './dto/matching.response';
import { MatchingRequestStatusEnum } from 'src/common/enum/matchingRequestStatus';

@Injectable()
export class MatchingService {
  constructor(
    @InjectRepository(Matching)
    private readonly matchingRepository: Repository<Matching>,
    private readonly chatRoomService: ChatRoomService,
    private readonly chatMessageService: ChatMessageService,
    private readonly dataSource: DataSource,
  ) {}
  async getMatchingByUserId(
    requesterId: number,
    targetId: number,
  ): Promise<Matching> {
    return await this.matchingRepository.findOne({
      where: [
        {
          requester: { id: requesterId },
          target: { id: targetId },
          status: 'activated',
        },
        {
          requester: { id: targetId },
          target: { id: requesterId },
          status: 'activated',
        },
      ],
    });
  }

  async getMatchingsByCurrentId(currentUserId: number): Promise<Matching[]> {
    return await this.matchingRepository.find({
      relations: ['requester', 'target'],
      where: [
        { requester: { id: currentUserId }, status: 'activated' },
        { target: { id: currentUserId }, status: 'activated' },
      ],
    });
  }

  async createMatching(body: CreateMatchingReqeust): Promise<ChatRoom> {
    let matching, chatRoom;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      matching = await queryRunner.manager.save(Matching, {
        requester: { id: body.requesterId },
        target: { id: body.targetId },
      });

      chatRoom = await this.chatRoomService.createChatRoom(
        queryRunner,
        matching,
        body,
      );

      await this.chatMessageService.createChatMessage(
        queryRunner,
        chatRoom,
        body,
      );
      await queryRunner.commitTransaction();

      return chatRoom;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw InternalServerException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async patchMatchingRequestStatus(
    matching: Matching,
    body: PatchMatchingRequest,
  ): Promise<Matching> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (body.requestStatus === 'accept') {
        matching.requestStatus = MatchingRequestStatusEnum.ACCEPTED;
        matching.acceptedAt = new Date();

        const chatRoom = await this.chatRoomService.getChatRoomByMatchingId(
          matching.id,
        );
        chatRoom.requestStatus = 'accepted';
        await queryRunner.manager.save(chatRoom);
      } else if (body.requestStatus === 'reject') {
        matching.requestStatus = MatchingRequestStatusEnum.REJECTED;
        matching.rejectedAt = new Date();
      }

      await queryRunner.manager.save(matching);
      await queryRunner.commitTransaction();

      return matching;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw InternalServerException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async getMatchings(currentUserId: number): Promise<GetMatchingsResponse> {
    const matchings = await this.matchingRepository
      .createQueryBuilder('matching')
      .leftJoinAndSelect('matching.requester', 'requester')
      .leftJoinAndSelect('requester.posts', 'post')
      .leftJoinAndSelect('post.postImages', 'image')
      .leftJoinAndSelect('post.postStyletags', 'styleTag')
      .leftJoinAndSelect('styleTag.styletag', 'styletag')
      .where('matching.targetId = :currentUserId', { currentUserId })
      .andWhere('matching.requestStatus = :status', { status: 'pending' })
      .andWhere('matching.status = :activated', { activated: 'activated' })
      .orderBy(
        // 우선순위: isRepresentative가 true인 게시물 먼저, 그 다음은 최신 게시물
        'CASE WHEN post.isRepresentative = true THEN 0 ELSE 1 END',
        'ASC',
      )
      .addOrderBy('post.createdAt', 'DESC')
      .getMany();

    const response: GetMatchingsResponse = {
      isMatching: matchings.length > 0,
      matchingsCount: matchings.length,
      matching: matchings.map((matching) => {
        const requesterPost = matching.requester.posts[0];

        return {
          matchingId: matching.id,
          requester: {
            requesterId: matching.requester.id,
            nickname: matching.requester.nickname,
            profilePictureUrl: matching.requester.profilePictureUrl,
          },
          requesterPost: {
            postImages: requesterPost.postImages.map((image) => ({
              url: image.url,
              orderNum: image.orderNum,
            })),
            styleTags: requesterPost.postStyletags
              ? requesterPost.postStyletags.map(
                  (styleTag) => styleTag.styletag.tag,
                )
              : [],
          },
        };
      }),
    };

    return response;
  }

  async getMatchingById(matchingId: number): Promise<Matching> {
    const matching = await this.matchingRepository.findOne({
      where: { id: matchingId },
      relations: ['target', 'requester'],
    });
    if (!matching) {
      throw DataNotFoundException('해당 매칭 요청을 찾을 수 없습니다.');
    }
    return matching;
  }

  async existsMatching(
    requesterId: number,
    targetId: number,
  ): Promise<boolean> {
    const matching = await this.matchingRepository.findOne({
      where: [
        {
          requester: { id: requesterId },
          target: { id: targetId },
          requestStatus: MatchingRequestStatusEnum.ACCEPTED,
          status: 'activated',
        },
        {
          requester: { id: targetId },
          target: { id: requesterId },
          requestStatus: MatchingRequestStatusEnum.ACCEPTED,
          status: 'activated',
        },
      ],
    });

    return !!matching; // 매칭 데이터가 있으면 true 반환
  }
}
