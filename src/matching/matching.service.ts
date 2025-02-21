import { Injectable } from '@nestjs/common';
import {
  CreateMatchingRequest,
  PatchMatchingRequest,
} from './dto/matching.request';
import { DataSource, Repository } from 'typeorm';
import { Matching } from 'src/common/entities/matching.entity';
import { ChatRoomService } from '../chat-room/chat-room.service';
import { InternalServerException } from 'src/common/exception/service.exception';
import { ChatMessageService } from 'src/chat-message/chat-message.service';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateMatchingResponse,
  GetMatchingsResponse,
  GetOneMatchingResponse,
} from './dto/matching.response';
import { MatchingRequestStatusEnum } from 'src/common/enum/matchingRequestStatus';
import { StatusEnum } from 'src/common/enum/entityStatus';
import dayjs from 'dayjs';

@Injectable()
export class MatchingService {
  constructor(
    @InjectRepository(Matching)
    private readonly matchingRepository: Repository<Matching>,
    private readonly chatRoomService: ChatRoomService,
    private readonly chatMessageService: ChatMessageService,
    private readonly dataSource: DataSource,
  ) {}

  async getMatchingsByCurrentId(currentUserId: number): Promise<Matching[]> {
    return await this.matchingRepository.find({
      relations: ['requester', 'target'],
      where: [
        { requester: { id: currentUserId }, status: StatusEnum.ACTIVATED },
        { target: { id: currentUserId }, status: StatusEnum.ACTIVATED },
      ],
    });
  }

  async createMatching(
    body: CreateMatchingRequest,
  ): Promise<CreateMatchingResponse> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const matching = await queryRunner.manager.save(Matching, {
        requester: { id: body.requesterId },
        target: { id: body.targetId },
        message: body.message,
      });

      const chatRoom = await this.chatRoomService.createChatRoom(
        queryRunner,
        matching,
        body,
      );

      await this.chatMessageService.createChatMessage(
        queryRunner,
        chatRoom,
        body,
      );

      const matchingInfo = await queryRunner.manager
        .createQueryBuilder(Matching, 'matching')
        .leftJoinAndSelect('matching.target', 'target')
        .leftJoinAndSelect('matching.requester', 'requester')
        .leftJoinAndSelect('requester.posts', 'post')
        .leftJoinAndSelect('post.postImages', 'image')
        .leftJoinAndSelect('post.postStyletags', 'styleTag')
        .leftJoinAndSelect('styleTag.styletag', 'styletag')
        .where('matching.id = :id', { id: matching.id })
        .getOne();

      const requesterPost = matchingInfo.requester.posts[0];

      await queryRunner.commitTransaction();

      return {
        id: matchingInfo.id,
        message: body.message,
        createdAt: dayjs(matching.createdAt).format('YYYY-MM-DDTHH:mm:ssZ'),
        chatRoomId: chatRoom.id,
        targetId: body.targetId,
        requester: {
          id: body.requesterId,
          nickname: matchingInfo.requester.nickname,
          profilePictureUrl: matchingInfo.requester.profilePictureUrl,
          representativePost: requesterPost
            ? {
                postImages: requesterPost.postImages.map((image) => ({
                  url: image.url,
                  orderNum: image.orderNum,
                })),
                styleTags: requesterPost.postStyletags
                  ? requesterPost.postStyletags.map(
                      (styleTag) => styleTag.styletag.tag,
                    )
                  : [],
              }
            : {},
        },
      };
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
    const chatRoom = await this.chatRoomService.getChatRoomByMatchingId(
      matching.id,
    );
    try {
      console.log(body.requestStatus);
      if (body.requestStatus === 'accept') {
        matching.requestStatus = MatchingRequestStatusEnum.ACCEPTED;
        matching.acceptedAt = new Date();
        chatRoom.requestStatus = MatchingRequestStatusEnum.ACCEPTED;
      } else if (body.requestStatus === 'reject') {
        matching.requestStatus = MatchingRequestStatusEnum.REJECTED;
        matching.rejectedAt = new Date();
        chatRoom.requestStatus = MatchingRequestStatusEnum.REJECTED;
        chatRoom.status = StatusEnum.DEACTIVATED;
        chatRoom.softDelete();
      }
      await queryRunner.manager.save(chatRoom);
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

  async getLatestMatching(
    userId: number,
  ): Promise<GetOneMatchingResponse | {}> {
    const matching = await this.matchingRepository.findOne({
      where: { target: { id: userId } },
      relations: ['target', 'requester'],
      order: { createdAt: 'DESC' },
    });

    if (!matching) {
      return null;
    }

    return {
      id: matching.id,
      requesterId: matching.requester.id,
      targetId: matching.target.id,
      requestStatus: matching.requestStatus,
      createdAt: dayjs(matching.createdAt).format('YYYY-MM-DDTHH:mm:ssZ'),
    };
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
      .andWhere('matching.requestStatus = :status', {
        status: MatchingRequestStatusEnum.PENDING,
      })
      .andWhere('matching.status = :activated', {
        activated: StatusEnum.ACTIVATED,
      })
      .andWhere('requester.status = :activated', {
        activated: StatusEnum.ACTIVATED,
      })
      .orderBy('matching.createdAt', 'DESC')
      .addOrderBy('post.isRepresentative', 'DESC') // 'isRepresentative'가 true인 게시물을 우선적으로 정렬
      .addOrderBy('post.createdAt', 'DESC') // 그 다음은 최신 게시물 우선으로 정렬
      .getMany();

    const response: GetMatchingsResponse = {
      hasMatching: matchings.length > 0,
      matchingsCount: matchings.length,
      matching: matchings.map((matching) => {
        const requesterPost = matching.requester.posts[0];

        return {
          id: matching.id,
          requester: {
            id: matching.requester.id,
            nickname: matching.requester.nickname,
            profilePictureUrl: matching.requester.profilePictureUrl,
            representativePost: requesterPost
              ? {
                  postImages: requesterPost.postImages.map((image) => ({
                    url: image.url,
                    orderNum: image.orderNum,
                  })),
                  styleTags: requesterPost.postStyletags
                    ? requesterPost.postStyletags.map(
                        (styleTag) => styleTag.styletag.tag,
                      )
                    : [],
                }
              : {},
          },
        };
      }),
    };
    return response;
  }

  async getMatchingById(matchingId: number): Promise<Matching> {
    return await this.matchingRepository.findOne({
      where: { id: matchingId },
      relations: ['target', 'requester'],
    });
  }

  async isMatching(requesterId: number, targetId: number): Promise<boolean> {
    const count = await this.matchingRepository.count({
      where: [
        {
          requester: { id: requesterId },
          target: { id: targetId },
          requestStatus: MatchingRequestStatusEnum.ACCEPTED,
          status: StatusEnum.ACTIVATED,
        },
        {
          requester: { id: targetId },
          target: { id: requesterId },
          requestStatus: MatchingRequestStatusEnum.ACCEPTED,
          status: StatusEnum.ACTIVATED,
        },
      ],
    });

    return count > 0;
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
          status: StatusEnum.ACTIVATED,
        },
        {
          requester: { id: targetId },
          target: { id: requesterId },
          status: StatusEnum.ACTIVATED,
        },
      ],
    });

    // 매칭이 없거나 REJECTED 상태이면 false
    if (
      !matching ||
      matching.requestStatus === MatchingRequestStatusEnum.REJECTED
    ) {
      return false;
    }
    return true;
  }
}
