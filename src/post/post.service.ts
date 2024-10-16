import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { Post } from '../common/entities/post.entity';
import { GetPostsResponse } from './dtos/total-postsResponse.dto';
import {
  GetMyPostsResponse,
  GetOtherPostsResponse,
} from './dtos/user-postsResponse.dto';
import { UserService } from 'src/user/user.service';
import { PostImageService } from 'src/post-image/post-image.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { PostStyletagService } from '../post-styletag/post-styletag.service';
import {
  DataNotFoundException,
  InternalServerException,
} from 'src/common/exception/service.exception';
import { PatchPostDto } from './dtos/patch-Post.dto';
import { UserBlockService } from 'src/user-block/user-block.service';
import { PostClothingService } from 'src/post-clothing/post-clothing.service';
import { GetPostResponse } from './dtos/get-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly userBlockService: UserBlockService,
    private readonly userService: UserService,
    private readonly postImageService: PostImageService,
    private readonly postStyletagService: PostStyletagService,
    private readonly postClothingService: PostClothingService,
    private readonly dataSource: DataSource,
  ) {}

  //게시글 리스트 조회
  async getPosts(
    userId?: number,
    currentUserId?: number,
  ): Promise<GetPostsResponse | GetMyPostsResponse | GetOtherPostsResponse> {
    const where = userId ? { user: { id: userId } } : {};
    const relations = ['postImages', 'postComments', 'postLikes', 'user'];

    // 차단된 사용자 ID 목록 가져오기
    const blockedUserIds = currentUserId
      ? await this.userBlockService.getBlockedUserIds(currentUserId)
      : [];

    const posts = await this.postRepository.find({
      where: where,
      relations: relations,
    });

    const filteredPosts = posts.filter(
      (post) => !blockedUserIds.includes(post.user.id),
    );

    if (!filteredPosts || filteredPosts.length === 0) {
      throw DataNotFoundException('게시글을 찾을 수 없습니다.');
    }

    if (!userId) {
      // 전체 게시글 조회
      return this.PostsResponse(filteredPosts, currentUserId);
    } else if (userId === currentUserId) {
      // 내 게시글 조회
      return this.userPostsResponse(posts, currentUserId, true);
    } else {
      // 다른 user 게시글 조회
      return this.userPostsResponse(posts, currentUserId, false);
    }
  }

  private PostsResponse(posts: Post[], currentUserId?: number) {
    return {
      post: posts.map((post) => ({
        content: post.content,
        createdAt: post.createdAt,
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

  private userPostsResponse(
    posts: Post[],
    currentUserId: number,
    isMyPosts: boolean,
  ) {
    const commonPosts = posts.map((post) => ({
      content: post.content,
      createdAt: post.createdAt,
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

  //게시글 생성
  async createPost(uploadPostDto: CreatePostDto, userId: number) {
    const {
      content,
      postImages,
      isRepresentative,
      postStyletags,
      postClothings,
    } = uploadPostDto;

    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();

    await queryRunner.startTransaction();

    try {
      const user = await this.userService.findByFields({
        where: { id: userId },
      });

      const post = this.postRepository.create({
        user,
        content,
        isRepresentative,
      });

      // 게시글 저장
      const savedPost = await queryRunner.manager.save(post);

      // 이미지 저장
      await this.postImageService.savePostImages(
        postImages,
        savedPost,
        queryRunner,
      );

      // 스타일태그 저장
      if (postStyletags) {
        await this.postStyletagService.savePostStyletags(
          savedPost,
          postStyletags,
          queryRunner,
        );
      }

      // 옷 정보 저장
      if (postClothings) {
        await this.postClothingService.savePostClothings(
          savedPost,
          postClothings,
          queryRunner,
        );
      }

      await queryRunner.commitTransaction();

      return savedPost;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw InternalServerException('게시글 저장에 실패했습니다.');
    } finally {
      await queryRunner.release();
    }
  }

  // 게시글 수정
  async patchPost(postId: number, patchPostDto: PatchPostDto, userId: number) {
    const {
      content,
      postImages,
      isRepresentative,
      postStyletags,
      postClothings,
    } = patchPostDto;

    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();

    await queryRunner.startTransaction();

    try {
      const post = await this.postRepository.findOne({
        where: { id: postId, user: { id: userId } },
      });

      if (!post) {
        throw DataNotFoundException('게시글을 찾을 수 없습니다.');
      }

      if (content !== undefined) {
        post.content = content;
      }
      if (isRepresentative !== undefined) {
        post.isRepresentative = isRepresentative;
      }

      const updatedPost = await queryRunner.manager.save(post);

      // postImage 업데이트
      if (postImages) {
        await this.postImageService.savePostImages(
          postImages,
          updatedPost,
          queryRunner,
        );
      }

      // styletag 업데이트
      if (postStyletags) {
        await this.postStyletagService.savePostStyletags(
          updatedPost,
          postStyletags,
          queryRunner,
        );
      }

      // clothing 업데이트
      if (postClothings) {
        await this.postClothingService.savePostClothings(
          updatedPost,
          postClothings,
          queryRunner,
        );
      }

      await queryRunner.commitTransaction();

      return updatedPost;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw InternalServerException('게시글 수정에 실패했습니다.');
    } finally {
      await queryRunner.release();
    }
  }

  // 게시글 상세 조회
  async getPost(
    postId: number,
    currentUserId?: number,
  ): Promise<GetPostResponse> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['postImages'],
    });

    if (!post) {
      throw DataNotFoundException('게시글을 찾을 수 없습니다.');
    }

    return {
      post: {
        content: post.content,
        createdAt: post.createdAt,
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
      },
    };
  }

  //대표 게시글 지정
  async patchIsRepresentative(postId: number, currentUserId: number) {
    const post = await this.postRepository.findOne({
      where: { id: postId, user: { id: currentUserId } },
    });

    if (!post) {
      throw DataNotFoundException('게시글을 찾을 수 없습니다.');
    }

    post.isRepresentative = true;

    let updatedPost;
    try {
      updatedPost = await this.postRepository.save(post);
    } catch (error) {
      throw InternalServerException('게시글 수정에 실패했습니다.');
    }

    return updatedPost;
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
