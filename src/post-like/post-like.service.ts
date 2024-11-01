import { Injectable } from '@nestjs/common';
import { PostLike } from 'src/common/entities/post-like.entity';
import { QueryRunner } from 'typeorm';

@Injectable()
export class PostLikeService {
  async deletePostLikeByPostId(
    postId: number,
    queryRunner: QueryRunner,
  ): Promise<void> {
    const likesToRemove = await queryRunner.manager.find(PostLike, {
      where: { post: { id: postId } },
    });

    await Promise.all(
      likesToRemove.map(async (like) => {
        like.status = 'deactivated';
        like.softDelete();
        return queryRunner.manager.save(like);
      }),
    );
  }
}
