import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PostLike } from 'src/common/entities/post-like.entity';
import { QueryRunner } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostService } from '../post/post.service';
import { PostLikeResponseDto } from './dtos/post-like.response';
import { DataNotFoundException } from 'src/common/exception/service.exception';
import { GetPostLikesResponseDto } from './dtos/get-post-like.response.dto';
import { PageOptionsDto } from 'src/common/response/page-options.dto';
import { PageMetaDto } from 'src/common/response/page-meta.dto';
import { StatusEnum } from 'src/common/enum/entityStatus';

@Injectable()
export class PostLikeService {
  constructor(
    @InjectRepository(PostLike)
    private readonly postLikeRepository: Repository<PostLike>,
    @Inject(forwardRef(() => PostService))
    private readonly postService: PostService,
  ) {}

  async deletePostLikeByPostId(
    postId: number,
    queryRunner: QueryRunner,
  ): Promise<void> {
    const likesToRemove = await queryRunner.manager.find(PostLike, {
      where: { post: { id: postId } },
    });

    await Promise.all(
      likesToRemove.map(async (like) => {
        like.status = StatusEnum.DEACTIVATED;
        like.softDelete();
        return queryRunner.manager.save(like);
      }),
    );
  }

  // 유저가 좋아요 누른 게시물들 조회
  async getPostLikes(
    postId: number,
    pageOptionsDto: PageOptionsDto,
  ): Promise<GetPostLikesResponseDto> {
    // 전체 좋아요 수를 먼저 조회
    const [userLikes, totalLikes] = await this.postLikeRepository.findAndCount({
      where: { post: { id: postId }, status: StatusEnum.ACTIVATED },
      relations: ['user'],
      skip: (pageOptionsDto.page - 1) * pageOptionsDto.take, // 페이지에 따라 건너뛸 수
      take: pageOptionsDto.take, // 요청된 페이지 당 아이템 수
    });

    const likes = userLikes.map((like) => ({
      id: like.id,
      user: {
        id: like.user.id,
        email: like.user.email,
        nickname: like.user.nickname,
        profilePictureUrl: like.user.profilePictureUrl,
      },
      createdAt: like.createdAt,
    }));

    // 메타 정보를 담을 PageMetaDto 생성
    const meta = new PageMetaDto({
      pageOptionsDto,
      total: totalLikes,
    });

    return {
      totalCount: totalLikes,
      likes: likes,
      meta: meta, // 페이지 메타 정보 반환
    };
  }

  // 좋아요 상태값
  async toggleLike(
    postId: number,
    userId: number,
  ): Promise<PostLikeResponseDto> {
    const post = await this.postService.findByFields({
      where: { id: postId },
    });
    if (!post) {
      throw DataNotFoundException('게시글을 찾을 수 없습니다.');
    }

    const likeData = await this.postLikeRepository.findOne({
      where: {
        post: { id: postId },
        user: { id: userId },
      },
      relations: ['user', 'post'],
    });

    const allLikesData = await this.postLikeRepository.find({
      where: { post: { id: postId }, status: StatusEnum.ACTIVATED },
    });

    if (likeData) {
      // 좋아요 actiavated인 경우 -> 좋아요 취소
      // 좋아요 deactivated인 경우 -> 다시 좋아요 누름
      likeData.status =
        likeData.status === StatusEnum.DEACTIVATED
          ? StatusEnum.ACTIVATED
          : StatusEnum.DEACTIVATED;
      await this.postLikeRepository.save(likeData);
      return {
        id: likeData.post.id,
        isPostLike: likeData.status === 'activated',
        postLikesCount:
          likeData.status === 'activated'
            ? allLikesData.length + 1
            : allLikesData.length - 1,
      };
    } else {
      // 좋아요 생성 (처음 좋아요 눌림)
      const newLike = this.postLikeRepository.create({
        user: { id: userId },
        post: post,
        status: StatusEnum.ACTIVATED,
      });
      await this.postLikeRepository.save(newLike);
      return {
        id: newLike.post.id,
        isPostLike: newLike.status === 'activated',
        postLikesCount: allLikesData.length + 1,
      };
    }
  }
}
