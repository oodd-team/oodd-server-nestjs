import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindOneOptions, QueryRunner, Repository } from 'typeorm';
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
  ForbiddenException,
  InternalServerException,
  ServiceException,
} from 'src/common/exception/service.exception';
import { PatchPostDto } from './dtos/patch-Post.dto';
import { UserBlockService } from 'src/user-block/user-block.service';
import { PostClothingService } from 'src/post-clothing/post-clothing.service';
import dayjs from 'dayjs';
import { PostLikeService } from 'src/post-like/post-like.service';
import { PostCommentService } from 'src/post-comment/post-comment.service';
import { PageOptionsDto } from './dtos/page-options.dto';
import { PageDto } from './dtos/page.dto';
import { PageMetaDto } from './dtos/page-meta.dto';

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
    private readonly postLikeService: PostLikeService,
    @Inject(forwardRef(() => PostCommentService))
    private readonly postCommentService: PostCommentService,
    private readonly dataSource: DataSource,
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

    // totalPosts가 없을 경우 빈 배열 반환
    if (!totalPosts.length) {
      return new PageDto([], pageMetaDto);
    }

    const last_page = pageMetaDto.last_page;

    if (last_page < pageMetaDto.page) {
      throw DataNotFoundException('해당 페이지는 존재하지 않습니다');
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

  //게시글 생성
  async createPost(uploadPostDto: CreatePostDto, currentUserId: number) {
    const {
      content,
      postImages,
      isRepresentative,
      postStyletags,
      postClothings,
    } = uploadPostDto;

    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();

    await queryRunner.startTransaction();

    const user = await this.userService.findByFields({
      where: { id: currentUserId, status: 'activated' },
    });

    try {
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
  async patchPost(postId: number, patchPostDto: PatchPostDto) {
    const { content, postImages, postStyletags, postClothings } = patchPostDto;

    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();

    await queryRunner.startTransaction();

    const post = await this.postRepository.findOne({
      where: { id: postId, status: 'activated' },
    });

    try {
      if (content !== undefined) {
        post.content = content;
      }
      const updatedPost = await queryRunner.manager.save(post);

      // postImages 업데이트
      await this.postImageService.updatePostImages(
        postImages,
        updatedPost,
        queryRunner,
      );

      // styletag 업데이트
      await this.postStyletagService.updatePostStyletags(
        updatedPost,
        postStyletags,
        queryRunner,
      );

      // clothing 업데이트
      await this.postClothingService.updatePostClothings(
        updatedPost,
        postClothings,
        queryRunner,
      );

      await queryRunner.commitTransaction();

      return updatedPost;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof ServiceException) {
        throw error;
      }
      throw InternalServerException('게시글 수정에 실패했습니다.');
    } finally {
      await queryRunner.release();
    }
  }

  // 게시글 삭제
  async deletePost(postId: number, userId: number): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.startTransaction();

    // 게시글 조회
    const post = await this.postRepository.findOne({
      where: { id: postId, user: { id: userId }, status: 'activated' },
    });

    try {
      // 게시글 삭제
      post.status = 'deactivated';
      post.softDelete();

      await queryRunner.manager.save(post);

      // 연결된 PostImage 삭제
      await this.postImageService.deleteImagesByPostId(postId, queryRunner);

      // 연결된 PostLike 삭제
      await this.postLikeService.deletePostLikeByPostId(postId, queryRunner);

      // 연결된 PostComment 삭제
      await this.postCommentService.deleteCommentsByPostId(postId, queryRunner);

      // 연결된 PostClothing 삭제
      await this.postClothingService.deletePostClothingByPostId(
        postId,
        queryRunner,
      );

      // 연결된 PostStyleTag 삭제
      await this.postStyletagService.deletePostStyletagsByPostId(
        postId,
        queryRunner,
      );

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw InternalServerException('게시글 삭제에 실패했습니다.');
    } finally {
      await queryRunner.release();
    }
  }

  // 게시글 상세 조회
  async getPost(postId: number): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id: postId, status: 'activated' },
      relations: [
        'postImages',
        'user',
        'postLikes',
        'postComments',
        'postClothings',
        'postClothings.clothing',
      ],
    });

    return post;
  }

  // 대표 게시글 설정
  async patchIsRepresentative(
    postId: number,
    currentUserId: number,
  ): Promise<Post> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.startTransaction();

    const post = await this.postRepository.findOne({
      where: { id: postId, user: { id: currentUserId }, status: 'activated' },
    });

    try {
      // 대표 게시글 지정
      if (!post.isRepresentative) {
        // 기존 대표 게시글이 있다면, 그 게시글의 isRepresentative를 false로 변경
        await queryRunner.manager.update(
          Post,
          {
            user: { id: currentUserId },
            isRepresentative: true,
            status: 'activated',
          },
          { isRepresentative: false },
        );

        // 현재 게시글을 대표로 설정
        post.isRepresentative = true;
      } else {
        // 대표 설정 해제
        post.isRepresentative = false;
      }

      const updatedPost = await queryRunner.manager.save(post);
      await queryRunner.commitTransaction();
      return updatedPost;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw InternalServerException('게시글 수정에 실패했습니다.');
    } finally {
      await queryRunner.release();
    }
  }

  // 게시글 검증 메서드
  async validatePost(postId: number, userId?: number): Promise<void> {
    const post = await this.postRepository.findOne({
      where: { id: postId, status: 'activated' },
      relations: ['user'],
    });

    if (!post) {
      throw DataNotFoundException('게시글을 찾을 수 없습니다.');
    }

    if (userId && post.user.id !== userId) {
      throw ForbiddenException('이 게시글에 대한 권한이 없습니다.');
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
  public checkIsPostLiked(post: Post, currentUserId: number): boolean {
    return post.postLikes.some((like) => like.user.id === currentUserId);
  }

  // 유저가 게시물에 댓글을 달았는지 확인
  private checkIsPostCommented(post: Post, currentUserId: number): boolean {
    return post.postComments.some(
      (comment) => comment.user.id === currentUserId,
    );
  }

  // Post 조회
  async findByFields(fields: FindOneOptions<Post>) {
    return await this.postRepository.findOne(fields);
  }
}
