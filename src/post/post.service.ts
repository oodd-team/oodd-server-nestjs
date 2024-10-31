import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../common/entities/post.entity';
import { GetPostsResponse } from './dtos/total-postsResponse.dto';
import {
  GetMyPostsResponse,
  GetOtherPostsResponse,
} from './dtos/user-postsResponse.dto';
import { UserBlockService } from 'src/user-block/user-block.service';
import dayjs from 'dayjs';
import { PageOptionsDto } from './dtos/page-options.dto';
import { PageDto } from './dtos/page.dto';
import { PageMetaDto } from './dtos/page-meta.dto';
import { DataNotFoundException } from 'src/common/exception/service.exception';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly userBlockService: UserBlockService,
  ) {}

  //게시글 리스트 조회
  async getPosts(
    pageOptionsDto: PageOptionsDto,
    userId?: number,
    currentUserId?: number,
  ): Promise<
    PageDto<GetPostsResponse | GetMyPostsResponse | GetOtherPostsResponse>
  > {
    const relations = [
      'postImages',
      'postComments',
      'postLikes',
      'user',
      'postLikes.user',
      'postComments.user',
    ];

    // 전체 게시물 리스트 조회
    const [totalPosts, total] = await this.postRepository.findAndCount({
      where: userId
        ? { user: { id: userId }, status: 'activated' }
        : { status: 'activated' },
      relations: relations,
      take: pageOptionsDto.take,
      skip: (pageOptionsDto.page - 1) * pageOptionsDto.take,
    });

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto,
      total,
    });

    const last_page = pageMetaDto.last_page;

    if (last_page < pageMetaDto.page) {
      throw DataNotFoundException('해당 페이지는 존재하지 않습니다');
    }

    // totalPosts가 없을 경우 빈 배열 반환
    if (!totalPosts.length) {
      return new PageDto([], pageMetaDto);
    }

    // 차단한 사용자 ID 목록 가져오기
    const blockedUserIds = currentUserId
      ? await this.userBlockService.getBlockedUserIdsByRequesterId(
          currentUserId,
        )
      : [];

    const filteredPosts = totalPosts.filter(
      (post) => !blockedUserIds.includes(post.user.id),
    );

    // filteredPosts 없을 경우 빈 배열 반환
    if (!filteredPosts.length) {
      return new PageDto([], pageMetaDto);
    }

    // userId 여부에 따라 응답 생성
    const postsResponse = userId
      ? this.createUserPostsResponse(
          totalPosts,
          currentUserId,
          userId == currentUserId,
        )
      : this.createPostsResponse(filteredPosts, currentUserId);

    return new PageDto([postsResponse], pageMetaDto);
  }

  // 전체 게시물 리스트 응답
  private createPostsResponse(
    posts: Post[],
    currentUserId?: number,
  ): GetPostsResponse {
    return {
      post: posts.map((post) => ({
        content: post.content,
        createdAt: dayjs(post.createdAt).format('YYYY-MM-DDTHH:mm:ssZ'),
        postImages: post.postImages
          .filter((image) => image.status === 'activated')
          .map((image) => ({
            url: image.url,
            orderNum: image.orderNum,
          })),
        isPostLike: this.checkIsPostLiked(post, currentUserId),
        isPostWriter: post.user.id === currentUserId,
        user: {
          nickname: post.user.nickname,
          profilePictureUrl: post.user.profilePictureUrl,
        },
      })),
      isMatching: false,
    };
  }

  // 사용자 게시물 응답
  private createUserPostsResponse(
    posts: Post[],
    currentUserId: number,
    isMyPosts: boolean,
  ): GetMyPostsResponse | GetOtherPostsResponse {
    const commonPosts = this.createCommonPosts(posts, currentUserId);

    if (isMyPosts) {
      // 내 게시물 리스트 조회
      return this.createMyPostsResponse(commonPosts, posts, currentUserId);
    } else {
      // 다른 사용자 게시물 리스트 조회
      return this.createOtherPostsResponse(commonPosts, posts);
    }
  }

  // 공통 응답
  private createCommonPosts(posts: Post[], currentUserId: number) {
    return posts.map((post) => ({
      createdAt: dayjs(post.createdAt).format('YYYY-MM-DDTHH:mm:ssZ'),
      imageUrl: post.postImages.find(
        (image) => image.orderNum == 1 && image.status === 'activated',
      )?.url,
      isRepresentative: post.isRepresentative,
      likeCount: post.postLikes.length,
      isPostLike: this.checkIsPostLiked(post, currentUserId),
    }));
  }

  // 내 게시물 응답
  private createMyPostsResponse(
    commonPosts: any[],
    posts: Post[],
    currentUserId: number,
  ): GetMyPostsResponse {
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
  }

  // 다른 사용자 게시물 응답
  private createOtherPostsResponse(
    commonPosts: any[],
    posts: Post[],
  ): GetOtherPostsResponse {
    return {
      posts: commonPosts,
      totalPosts: posts.length,
      totalLikes: this.calculateTotalLikes(posts),
    };
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
  public checkIsPostLiked(post: Post, currentUserId: number): boolean {
    return post.postLikes.some((like) => like.user.id === currentUserId);
  }

  // 유저가 게시물에 댓글을 달았는지 확인
  private checkIsPostCommented(post: Post, currentUserId: number): boolean {
    return post.postComments.some(
      (comment) => comment.user.id === currentUserId,
    );
  }
}
