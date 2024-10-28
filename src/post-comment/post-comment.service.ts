import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostComment } from 'src/common/entities/post-comment.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { DataNotFoundException } from 'src/common/exception/service.exception';
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
    const post = await this.findPostById(postId);
    const user = await this.findUserById(currentUserId);

    const postComment = this.postCommentRepository.create({
      content: createCommentDto.content,
      post,
      user,
    });

    return await this.postCommentRepository.save(postComment);
  }

  // 게시글 조회
  private async findPostById(postId: number) {
    const post = await this.postService.findByFields({ where: { id: postId } });
    if (!post) {
      throw DataNotFoundException('게시글을 찾을 수 없습니다.');
    }
    return post;
  }

  // 사용자 조회
  private async findUserById(userId: number) {
    const user = await this.userService.findByFields({
      where: { id: userId, status: 'activated' },
    });

    return user;
  }
}
