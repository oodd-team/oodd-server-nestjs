import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  FindOneOptions,
  In,
  Not,
  QueryRunner,
  Repository,
} from 'typeorm';
import { Post } from '../common/entities/post.entity';
import { UserService } from 'src/user/user.service';
import { PostImageService } from 'src/post-image/post-image.service';
import { CreatePostRequest } from './dtos/post.request';
import { PostStyletagService } from '../post-styletag/post-styletag.service';
import {
  DataNotFoundException,
  InternalServerException,
} from 'src/common/exception/service.exception';
import { PatchPostRequest } from './dtos/post.request';
import { UserBlockService } from 'src/user-block/user-block.service';
import { PostClothingService } from 'src/post-clothing/post-clothing.service';
import { PostLikeService } from 'src/post-like/post-like.service';
import { PostCommentService } from 'src/post-comment/post-comment.service';
import { PageOptionsDto } from './dtos/page-options.dto';

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

  async getAllPosts(
    pageOptionsDto: PageOptionsDto,
    currentUserId: number,
  ): Promise<{ posts: Post[]; total: number }> {
    const blockedUserIds =
      await this.userBlockService.getBlockedUserIdsByRequesterId(currentUserId);
    return this.findPostsWithPagination(pageOptionsDto, {
      status: 'activated',
      user: { id: Not(In(blockedUserIds)) },
    });
  }

  async getUserPosts(
    pageOptionsDto: PageOptionsDto,
    userId: number,
  ): Promise<{ posts: Post[]; total: number }> {
    return this.findPostsWithPagination(pageOptionsDto, {
      user: { id: userId },
      status: 'activated',
    });
  }

  async createPost(uploadPostDto: CreatePostRequest, currentUserId: number) {
    const {
      content,
      postImages,
      isRepresentative,
      postStyletag,
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

      if (postStyletag) {
        await this.postStyletagService.savePostStyletag(
          savedPost,
          postStyletag,
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

  async patchPost(post: Post, patchPostDto: PatchPostRequest) {
    const { content, postImages, postStyletags, postClothings } = patchPostDto;

    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (content !== undefined) {
        post.content = content;
      }
      const updatedPost = await queryRunner.manager.save(post);

      await this.postImageService.updatePostImages(
        postImages,
        updatedPost,
        queryRunner,
      );

      await this.postStyletagService.updatePostStyletags(
        updatedPost,
        postStyletags,
        queryRunner,
      );

      await this.postClothingService.updatePostClothings(
        updatedPost,
        postClothings,
        queryRunner,
      );

      await queryRunner.commitTransaction();
      return await this.postRepository.findOne({
        where: { id: updatedPost.id },
        relations: [
          'postImages',
          'postStyletags',
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

  private async findPostsWithPagination(
    pageOptionsDto: PageOptionsDto,
    whereCondition: object,
  ): Promise<{ posts: Post[]; total: number }> {
    const [posts, total] = await this.postRepository.findAndCount({
      where: whereCondition,
      relations: [
        'postImages',
        'postComments',
        'postLikes',
        'user',
        'postLikes.user',
        'postComments.user',
      ],
      take: pageOptionsDto.take,
      skip: (pageOptionsDto.page - 1) * pageOptionsDto.take,
    });

    return { posts, total };
  }

  async getPostById(postId: number): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id: postId, status: 'activated' },
      relations: ['user'],
    });

    if (!post) {
      throw DataNotFoundException('게시글을 찾을 수 없습니다.');
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
