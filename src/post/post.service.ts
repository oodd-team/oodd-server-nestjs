import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../common/entities/post.entity';
import { GetPostsResponse } from './dtos/total-postsResponse.dto';
import {
  GetMyPostsResponse,
  GetOtherPostsResponse,
} from './dtos/user-postsResponse.dto';
import { DataNotFoundException } from 'src/common/exception/service.exception';
import { UserBlockService } from 'src/user-block/user-block.service';
import { User } from 'src/common/entities/user.entity';
import { DayjsModule } from 'src/common/dayjs/dayjs.module';
import dayjs, { Dayjs } from 'dayjs';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly userBlockService: UserBlockService,
  ) {}

  //게시글 리스트 조회
  async getPosts(
    userId?: number,
    currentUserId?: number,
  ): Promise<GetPostsResponse | GetMyPostsResponse | GetOtherPostsResponse> {
    const relations = ['postImages', 'postComments', 'postLikes', 'user'];

    // 차단된 사용자 ID 목록 가져오기
    const blockedUserIds = currentUserId
      ? await this.userBlockService.getBlockedUserIdsByRequesterId(
          currentUserId,
        )
      : [];

    const totalposts = await this.postRepository.find({
      where: userId
        ? { user: { id: userId }, status: 'activated' }
        : { status: 'activated' },
      relations: relations,
    });

    const filteredPosts = totalposts.filter(
      (post) => !blockedUserIds.includes(post.user.id),
    );

    if (!filteredPosts || filteredPosts.length === 0) {
      return this.createPostsResponse([], currentUserId);
    }

    if (!userId) {
      // 전체 게시글 조회
      return this.createPostsResponse(filteredPosts, currentUserId);
    } else if (userId === currentUserId) {
      // 내 게시글 조회
      return this.createUserPostsResponse(totalposts, currentUserId, true);
    } else {
      // 다른 user 게시글 조회
      return this.createUserPostsResponse(totalposts, currentUserId, false);
    }
  }

  private createPostsResponse(posts: Post[], currentUserId?: number) {
    return {
      post: posts.map((post) => ({
        content: post.content,
        createdAt: new Dayjs(post.createdAt).format('YYYY-MM-DDTHH:mm:ssZ'),
        postImages: post.postImages.map((image) => ({
          url: image.url,
          orderNum: image.orderNum,
        })),
        isPostLike: this.checkIsPostLiked(post, currentUserId),
        user: {
          nickname: post.user.nickname,
          profilePictureUrl: post.user.profilePictureUrl,
        },
        isPostWriter: post.user.id === currentUserId,
      })),
      isMatching: false,
    };
  }

  private createUserPostsResponse(
    posts: Post[],
    currentUserId: number,
    isMyPosts: boolean,
  ) {
    const commonPosts = posts.map((post) => ({
      content: post.content,
      createdAt: new Dayjs(post.createdAt).format('YYYY-MM-DDTHH:mm:ssZ'),
      imageUrl: post.postImages.find((image) => image.orderNum === 1)?.url,
      isRepresentative: post.isRepresentative,
      likeCount: post.postLikes.length,
      isPostLike: this.checkIsPostLiked(post, currentUserId),
    }));

    if (isMyPosts) {
      // 내 게시글
      return {
        posts: commonPosts.map((post, index) => ({
          ...post,
          commentCount: posts[index].postComments.length,
          isPostComment: this.checkIsPostCommented(posts[index], currentUserId),
        })),
        totalComments: this.calculateTotalComments(posts),
        totalPosts: posts.length,
        totalLikes: this.calculateTotalLikes(posts),
      };
    } else {
      // 다른 유저 게시글
      return {
        posts: commonPosts,
        totalPosts: posts.length,
        totalLikes: this.calculateTotalLikes(posts),
      };
    }
  }

  // 총 댓글 수
  private calculateTotalComments(posts: Post[]): number {
    return posts.reduce((acc, post) => acc + post.postComments.length, 0);
  }

  // 총 좋아요 수
  private calculateTotalLikes(posts: Post[]): number {
    return posts.reduce((acc, post) => acc + post.postLikes.length, 0);
  }

  // 유저가 게시물에 좋아요를 눌렀는지 확인
  private checkIsPostLiked(post: Post, currentUserId: number): boolean {
    return post.postLikes.some((like) => like.user.id === currentUserId);
  }

  // 유저가 게시물에 댓글을 달았는지 확인
  private checkIsPostCommented(post: Post, currentUserId: number): boolean {
    return post.postComments.some(
      (comment) => comment.user.id === currentUserId,
    );
  }
}
