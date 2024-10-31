import { Injectable } from '@nestjs/common';
import { PostComment } from 'src/common/entities/post-comment.entity';
import { QueryRunner } from 'typeorm';

@Injectable()
export class PostCommentService {
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
