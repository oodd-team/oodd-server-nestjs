import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostComment } from 'src/common/entities/post-comment.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dtos/create-comment.dto';
import {
  DataNotFoundException,
  ForbiddenException,
  InternalServerException,
} from 'src/common/exception/service.exception';
import { UserService } from 'src/user/user.service';
import { PostService } from 'src/post/post.service';

@Injectable()
export class PostCommentService {
  constructor(
    @InjectRepository(PostComment)
    private readonly postCommentRepository: Repository<PostComment>,
    private readonly userService: UserService,
    private readonly postService: PostService,
  ) {}

  // 댓글 생성
  async createPostComment(
    postId: number,
    currentUserId: number,
    createCommentDto: CreateCommentDto,
  ): Promise<PostComment> {
    const post = await this.postService.findByFields({ where: { id: postId } });
    if (!post) {
      throw DataNotFoundException('게시글을 찾을 수 없습니다.');
    }

    const user = await this.userService.findByFields({
      where: { id: currentUserId, status: 'activated' },
    });

    const postComment = this.postCommentRepository.create({
      content: createCommentDto.content,
      post,
      user,
    });

    return await this.postCommentRepository.save(postComment);
  }

  // 댓글 삭제
  async deletePostComment(
    commentId: number,
    currentUserId: number,
  ): Promise<void> {
    const comment = await this.postCommentRepository.findOne({
      where: { id: commentId, status: 'activated' },
      relations: ['user'],
    });

    if (!comment) {
      throw DataNotFoundException('댓글을 찾을 수 없습니다.');
    }

    if (comment.user.id !== currentUserId) {
      throw ForbiddenException('댓글을 삭제할 권한이 없습니다.');
    }

    try {
      comment.status = 'deactivated';
      comment.softDelete();

      await this.postCommentRepository.save(comment);
    } catch (error) {
      throw InternalServerException('댓글 삭제에 실패했습니다.');
    }
  }
}
