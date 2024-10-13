import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostComment } from 'src/common/entities/post-comment.entity';
import { Post } from 'src/common/entities/post.entity';
import { User } from 'src/common/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dtos/create-comment.dto';
import {
  DataNotFoundException,
  ForbiddenException,
} from 'src/common/exception/service.exception';

@Injectable()
export class PostCommentService {
  constructor(
    @InjectRepository(PostComment)
    private readonly postCommentRepository: Repository<PostComment>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // 댓글 생성
  async createPostComment(
    postId: number,
    currentUserId: number,
    createCommentDto: CreateCommentDto,
  ): Promise<PostComment> {
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw DataNotFoundException('게시글을 찾을 수 없습니다.');
    }

    const user = await this.userRepository.findOne({
      where: { id: currentUserId },
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
      where: { id: commentId },
      relations: ['user'],
    });

    if (!comment) {
      throw DataNotFoundException('댓글을 찾을 수 없습니다.');
    }

    if (comment.user.id !== currentUserId) {
      throw ForbiddenException('댓글을 삭제할 권한이 없습니다.');
    }

    await this.postCommentRepository.remove(comment);
  }
}
