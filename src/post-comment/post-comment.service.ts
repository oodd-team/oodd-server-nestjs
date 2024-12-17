import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PostComment } from 'src/common/entities/post-comment.entity';
import { In, Not, QueryRunner } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dtos/create-comment.dto';
import {
  DataNotFoundException,
  ForbiddenException,
  InternalServerException,
} from 'src/common/exception/service.exception';
import { UserService } from 'src/user/user.service';
import { PostService } from 'src/post/post.service';
import { StatusEnum } from 'src/common/enum/entityStatus';

@Injectable()
export class PostCommentService {
  constructor(
    @InjectRepository(PostComment)
    private readonly postCommentRepository: Repository<PostComment>,
    private readonly userService: UserService,
    @Inject(forwardRef(() => PostService))
    private readonly postService: PostService,
  ) {}

  // 댓글 생성
  async createPostComment(
    postId: number,
    currentUserId: number,
    createCommentDto: CreateCommentDto,
  ): Promise<PostComment> {
    const post = await this.postService.findByFields({
      where: { id: postId, status: StatusEnum.ACTIVATED },
    });
    const user = await this.userService.findByFields({
      where: { id: currentUserId, status: StatusEnum.ACTIVATED },
    });
    const postComment = this.postCommentRepository.create({
      content: createCommentDto.content,
      post,
      user,
    });

    return await this.postCommentRepository.save(postComment);
  }

  // post와 연결된 댓글 삭제
  async deleteCommentsByPostId(
    postId: number,
    queryRunner: QueryRunner,
  ): Promise<void> {
    const commentsToRemove = await queryRunner.manager.find(PostComment, {
      where: { post: { id: postId } },
    });

    await Promise.all(
      commentsToRemove.map(async (comment) => {
        comment.status = StatusEnum.DEACTIVATED;
        comment.softDelete();
        return queryRunner.manager.save(comment);
      }),
    );
  }

  // 댓글 삭제
  async deletePostComment(commentId: number): Promise<void> {
    const queryRunner =
      this.postCommentRepository.manager.connection.createQueryRunner();
    await queryRunner.startTransaction();

    const comment = await this.findCommentById(commentId);

    try {
      comment.status = StatusEnum.DEACTIVATED;
      comment.softDelete();

      await queryRunner.manager.save(comment);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw InternalServerException('댓글 삭제에 실패했습니다.');
    } finally {
      await queryRunner.release();
    }
  }

  // 댓글 리스트 조회
  async getPostComments(
    postId: number,
    blockedUserIds: number[],
  ): Promise<PostComment[]> {
    return await this.postCommentRepository.find({
      where: {
        post: { id: postId },
        status: StatusEnum.ACTIVATED,
        user: { status: StatusEnum.ACTIVATED, id: Not(In(blockedUserIds)) },
      },
      relations: ['user'],
    });
  }

  private async findCommentById(commentId: number): Promise<PostComment> {
    const comment = await this.postCommentRepository.findOne({
      where: {
        id: commentId,
        status: StatusEnum.ACTIVATED,
        user: { status: StatusEnum.ACTIVATED },
      },
      relations: ['user'],
    });

    if (!comment) {
      throw DataNotFoundException('댓글을 찾을 수 없습니다.');
    }

    return comment;
  }

  async validateUser(commentId: number, currentUserId: number): Promise<void> {
    const comment = await this.findCommentById(commentId);

    if (comment.user.id !== currentUserId) {
      throw ForbiddenException('댓글을 삭제할 권한이 없습니다.');
    }
  }
}
