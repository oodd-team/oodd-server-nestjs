import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PostComment } from 'src/common/entities/post-comment.entity';
import { QueryRunner } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { UserService } from 'src/user/user.service';
import { PostService } from 'src/post/post.service';

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
      where: { id: postId, status: 'activated' },
    });
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
        comment.status = 'deactivated';
        comment.softDelete();
        return queryRunner.manager.save(comment);
      }),
    );
  }
}
