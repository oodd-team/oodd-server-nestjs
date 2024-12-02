import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindOneOptions, QueryRunner, Repository } from 'typeorm';
import { Post } from '../common/entities/post.entity';
import { UserService } from 'src/user/user.service';
import { PostImageService } from 'src/post-image/post-image.service';
import { CreatePostRequest } from './dto/request/post.request';
import { PostStyletagService } from '../post-styletag/post-styletag.service';
import {
  DataNotFoundException,
  InternalServerException,
} from 'src/common/exception/service.exception';
import { PatchPostRequest } from './dto/request/post.request';
import { UserBlockService } from 'src/user-block/user-block.service';
import { PostClothingService } from 'src/post-clothing/post-clothing.service';
import { PostLikeService } from 'src/post-like/post-like.service';
import { PostCommentService } from 'src/post-comment/post-comment.service';
import { PageOptionsDto } from '../common/response/page-options.dto';
import { GetAllPostsResponse } from './dto/all-posts.response';
import {
  GetMyPostsResponse,
  GetOtherPostsResponse,
  PostDto,
} from './dto/user-posts.response';
import { GetAllPostDto } from './dto/dto/get-all-posts.dto';
import { MatchingService } from 'src/matching/matching.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly userBlockService: UserBlockService,
    private readonly matchingService: MatchingService,
    private readonly userService: UserService,
    private readonly postImageService: PostImageService,
    private readonly postStyletagService: PostStyletagService,
    private readonly postClothingService: PostClothingService,
    private readonly postLikeService: PostLikeService,
    @Inject(forwardRef(() => PostCommentService))
    private readonly postCommentService: PostCommentService,
    private readonly dataSource: DataSource,
  ) {}

  async getAllPosts(
    pageOptionsDto: PageOptionsDto,
    currentUserId: number,
  ): Promise<{ posts: GetAllPostsResponse; total: number }> {
    const blockedUserIds =
      await this.userBlockService.getBlockedUserIdsByRequesterId(currentUserId);

    console.log(blockedUserIds);
    console.log(currentUserId);

    const queryBuilder = this.dataSource
      .getRepository(Post)
      .createQueryBuilder('post')
      .select(['post.id', 'post.content', 'post.createdAt'])
      .leftJoin('post.user', 'user')
      .addSelect(['user.id', 'user.nickname', 'user.profilePictureUrl'])
      .leftJoinAndSelect(
        'post.postImages',
        'postImage',
        'postImage.status = :status',
        { status: 'activated' },
      )
      .leftJoin(
        'post.postLikes',
        'postLike',
        'postLike.status = :status and postLike.postId = post.id and postLike.userId = :currentUserId',
        {
          status: 'activated',
          currentUserId,
        },
      )
      .addSelect(['postLike.id'])
      .where('post.status = :status', { status: 'activated' })
      .andWhere('user.status = :status', { status: 'activated' })
      .andWhere('user.id NOT IN (:currentUserId)', {
        currentUserId: [currentUserId],
      })
      .andWhere(
        blockedUserIds.length > 0
          ? 'user.id NOT IN (:...blockedUserIds)'
          : '1=1',
        { blockedUserIds },
      )
      .orderBy('post.createdAt', 'DESC')
      .take(pageOptionsDto.take)
      .skip((pageOptionsDto.page - 1) * pageOptionsDto.take);

    const posts = await queryBuilder.getMany();
    console.log(posts);

    const total = await queryBuilder.getCount();

    const currentUserMatchings =
      await this.matchingService.getMatchingsByCurrentId(currentUserId);

    return {
      posts: new GetAllPostsResponse(
        posts as unknown as GetAllPostDto[],
        currentUserId,
        currentUserMatchings,
      ),
      total,
    };
  }

  async getUserPosts(
    pageOptionsDto: PageOptionsDto,
    userId: number,
    currentUserId: number,
  ): Promise<{
    posts: GetMyPostsResponse | GetOtherPostsResponse;
    total: number;
  }> {
    const [posts, total] = await this.dataSource
      .getRepository(Post)
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect(
        'post.postImages',
        'postImage',
        'postImage.status = :status AND postImage.orderNum = :orderNum',
        { status: 'activated', orderNum: 1 },
      )
      .leftJoinAndSelect(
        'post.postLikes',
        'postLike',
        'postLike.status = :likeStatus',
        {
          likeStatus: 'activated',
        },
      )
      .leftJoinAndSelect('postLike.user', 'postLikeUser')
      .leftJoinAndSelect(
        'post.postComments',
        'postComment',
        'postComment.status = :commentStatus',
        {
          commentStatus: 'activated',
        },
      )
      .leftJoinAndSelect('postComment.user', 'postCommentUser')
      .where('post.status = :status', { status: 'activated' })
      .andWhere('post.user.id = :userId', { userId })
      .select([
        'post.id',
        'post.isRepresentative',
        'post.createdAt',
        'user.id',
        'postImage',
        'postComment.id',
        'postLike',
        'postLikeUser.id',
        'postCommentUser.id',
      ])
      .orderBy('post.createdAt', 'DESC')
      .take(pageOptionsDto.take)
      .skip((pageOptionsDto.page - 1) * pageOptionsDto.take)
      .getManyAndCount();

    return {
      posts:
        userId === currentUserId
          ? this.formatMyPosts(posts, currentUserId)
          : this.formatOtherPosts(posts, currentUserId),
      total,
    };
  }

  private formatMyPosts(
    posts: Post[],
    currentUserId: number,
  ): GetMyPostsResponse {
    return {
      post: posts.map((post) => new PostDto(post, currentUserId)),
      totalPostCommentsCount: this.calculateTotalComments(posts),
      totalPostsCount: posts.length,
      totalPostLikesCount: this.calculateTotalLikes(posts),
    };
  }

  private formatOtherPosts(
    posts: Post[],
    currentUserId: number,
  ): GetOtherPostsResponse {
    return {
      post: posts.map((post) => new PostDto(post, currentUserId)),
      totalPostsCount: posts.length,
      totalPostLikesCount: this.calculateTotalLikes(posts),
    };
  }

  async createPost(uploadPostDto: CreatePostRequest, currentUserId: number) {
    const {
      content,
      postImages,
      isRepresentative,
      postStyletags,
      postClothings,
    } = uploadPostDto;

    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const user = await this.userService.findByFields({
      where: { id: currentUserId, status: 'activated' },
    });

    try {
      if (isRepresentative) {
        await this.deactivateRepresentativePost(queryRunner, currentUserId);
      }

      const post = this.postRepository.create({
        user,
        content,
        isRepresentative,
      });
      const savedPost = await queryRunner.manager.save(post);

      await this.postImageService.savePostImages(
        postImages,
        savedPost,
        queryRunner,
      );

      if (postStyletags) {
        await this.postStyletagService.savePostStyletags(
          savedPost,
          postStyletags,
          queryRunner,
        );
      }

      if (postClothings) {
        await this.postClothingService.savePostClothings(
          savedPost,
          postClothings,
          queryRunner,
        );
      }

      await queryRunner.commitTransaction();

      return await this.postRepository.findOne({
        where: { id: savedPost.id },
        relations: [
          'postImages',
          'postStyletags',
          'postStyletags.styletag',
          'postStyletags.styletag',
          'postClothings',
          'user',
          'postClothings.clothing',
        ],
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw InternalServerException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async patchPost(
    post: Post,
    patchPostDto: PatchPostRequest,
    currentUserId: number,
  ) {
    const {
      content,
      isRepresentative,
      postImages,
      postStyletags,
      postClothings,
    } = patchPostDto;

    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (content !== undefined) {
        post.content = content;
      }

      if (isRepresentative) {
        await this.deactivateRepresentativePost(queryRunner, currentUserId);
        post.isRepresentative = true;
      }
      const updatedPost = await queryRunner.manager.save(post);

      await this.postImageService.updatePostImages(
        postImages,
        updatedPost,
        queryRunner,
      );

      await this.postStyletagService.updatePostStyletag(
        updatedPost,
        postStyletags,
        queryRunner,
      );

      await this.postClothingService.updatePostClothings(
        updatedPost,
        postClothings,
        queryRunner,
      );

      const resultPost = await queryRunner.manager
        .getRepository(Post)
        .createQueryBuilder('post')
        .leftJoinAndSelect(
          'post.postImages',
          'postImage',
          'postImage.status = :status',
          { status: 'activated' },
        )
        .leftJoinAndSelect(
          'post.postStyletags',
          'postStyletag',
          'postStyletag.status = :status',
          { status: 'activated' },
        )
        .leftJoinAndSelect('postStyletag.styletag', 'styletag')
        .leftJoinAndSelect(
          'post.postClothings',
          'postClothing',
          'postClothing.status = :status',
          { status: 'activated' },
        )
        .leftJoinAndSelect('postClothing.clothing', 'clothing')
        .leftJoinAndSelect('post.user', 'user')
        .where('post.id = :id', { id: updatedPost.id })
        .getOne();

      await queryRunner.commitTransaction();
      return resultPost;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw InternalServerException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  // 게시글 삭제
  async deletePost(postId: number, userId: number): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.startTransaction();

    const post = await this.postRepository.findOne({
      where: { id: postId, user: { id: userId }, status: 'activated' },
    });

    try {
      post.status = 'deactivated';
      post.isRepresentative = false;
      post.softDelete();
      await queryRunner.manager.save(post);

      await this.postImageService.deleteImagesByPostId(postId, queryRunner);
      await this.postLikeService.deletePostLikeByPostId(postId, queryRunner);
      await this.postCommentService.deleteCommentsByPostId(postId, queryRunner);
      await this.postClothingService.deletePostClothingByPostId(
        postId,
        queryRunner,
      );

      await this.postStyletagService.deletePostStyletagsByPostId(
        postId,
        queryRunner,
      );

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw InternalServerException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  // 게시글 상세 조회
  async getPost(postId: number, currentUserId: number): Promise<Post | null> {
    const blockedUserIds =
      await this.userBlockService.getBlockedUserIdsByRequesterId(currentUserId);
    return await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect(
        'post.postImages',
        'postImage',
        'postImage.status = :imageStatus',
        { imageStatus: 'activated' },
      )
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect(
        'post.postLikes',
        'postLike',
        'postLike.status = :likeStatus AND postLike.user.id NOT IN (:...blockedUserIds)',
        {
          likeStatus: 'activated',
          blockedUserIds: blockedUserIds.length > 0 ? blockedUserIds : [-1], // 차단된 사용자가 없으면 무효화된 조건 (-1)
        },
      )
      .leftJoinAndSelect('postLike.user', 'postLikeUser')
      .leftJoinAndSelect(
        'post.postComments',
        'postComment',
        'postComment.status = :commentStatus AND postComment.user.id NOT IN (:...blockedUserIds)',
        {
          commentStatus: 'activated',
          blockedUserIds: blockedUserIds.length > 0 ? blockedUserIds : [-1],
        },
      )
      .leftJoinAndSelect('postComment.user', 'postCommentUser')
      .leftJoinAndSelect(
        'post.postClothings',
        'postClothing',
        'postClothing.status = :clothingStatus',
        { clothingStatus: 'activated' },
      )
      .leftJoinAndSelect('postClothing.clothing', 'clothing')
      .leftJoinAndSelect(
        'post.postStyletags',
        'postStyletag',
        'postStyletag.status = :styletagStatus',
        { styletagStatus: 'activated' },
      )
      .leftJoinAndSelect('postStyletag.styletag', 'styletag')
      .where('post.id = :postId', { postId })
      .andWhere('post.status = :postStatus', { postStatus: 'activated' })
      .getOne();
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
        await this.deactivateRepresentativePost(queryRunner, currentUserId);
        post.isRepresentative = true;
      } else {
        post.isRepresentative = false;
      }

      const updatedPost = await queryRunner.manager.save(post);
      await queryRunner.commitTransaction();
      return updatedPost;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw InternalServerException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async getPostById(postId: number): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: {
        id: postId,
        status: 'activated',
      },
      relations: ['user'],
    });
    if (!post) {
      throw DataNotFoundException('게시물을 찾을 수 없습니다.');
    }
    return post;
  }

  private async deactivateRepresentativePost(
    queryRunner: QueryRunner,
    userId: number,
  ): Promise<void> {
    // 기존 대표 게시글이 있는 경우 해제
    await queryRunner.manager.update(
      Post,
      {
        user: { id: userId },
        isRepresentative: true,
        status: 'activated',
      },
      { isRepresentative: false },
    );
  }

  // 총 댓글 수
  calculateTotalComments(posts: Post[]): number {
    return posts.reduce((acc, post) => acc + post.postComments.length, 0);
  }

  // 총 좋아요 수
  calculateTotalLikes(posts: Post[]): number {
    return posts.reduce((acc, post) => acc + post.postLikes.length, 0);
  }

  // 유저가 게시물에 좋아요를 눌렀는지 확인
  checkIsPostLiked(post: Post, currentUserId: number): boolean {
    return post.postLikes.some((like) => like.user.id === currentUserId);
  }

  // 유저가 게시물에 댓글을 달았는지 확인
  checkIsPostCommented(post: Post, currentUserId: number): boolean {
    return post.postComments.some(
      (comment) => comment.user.id === currentUserId,
    );
  }

  // Post 조회
  async findByFields(fields: FindOneOptions<Post>) {
    return await this.postRepository.findOne(fields);
  }
}
