import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { PostStyletag } from 'src/common/entities/post-styletag.entity';
import { Post } from 'src/common/entities/post.entity';
import { StyletagService } from 'src/styletag/styletag.service';
import {
  DataNotFoundException,
  InternalServerException,
  InvalidInputValueException,
} from 'src/common/exception/service.exception';

@Injectable()
export class PostStyletagService {
  constructor(
    @InjectRepository(PostStyletag)
    private readonly postStyletagRepository: Repository<PostStyletag>,
    private readonly styletagService: StyletagService,
  ) {}

  async savePostStyletag(
    post: Post,
    tag: string,
    queryRunner: QueryRunner,
  ): Promise<void> {
    const styleTag = await this.styletagService.findStyleTag(tag);

    if (!styleTag) {
      throw DataNotFoundException('일치하는 스타일 태그가 없습니다.');
    }

    try {
      const postStyletag = this.postStyletagRepository.create({
        post,
        styletag: styleTag,
      });
      await queryRunner.manager.save(postStyletag);
    } catch (error) {
      throw InternalServerException(error.message);
    }
  }

  // 스타일 태그 수정
  async updatePostStyletag(
    post: Post,
    newTag: string,
    queryRunner?: QueryRunner,
  ): Promise<void> {
    const existingPostStyletag = await this.postStyletagRepository.findOne({
      where: { post, status: 'activated' },
      relations: ['styletag'],
    });

    if (!newTag) {
      if (existingPostStyletag) {
        await this.deletePostStyletag(existingPostStyletag, queryRunner);
      }
      return;
    }

    const styleTag = await this.styletagService.findStyleTag(newTag);

    if (!styleTag) {
      throw DataNotFoundException('일치하는 스타일 태그가 없습니다.');
    }

    if (
      existingPostStyletag &&
      existingPostStyletag.styletag.id === styleTag.id
    ) {
      return;
    }

    if (existingPostStyletag) {
      await this.deletePostStyletag(existingPostStyletag, queryRunner);
    }

    // 새로운 PostStyletag 추가
    const newPostStyletag = this.postStyletagRepository.create({
      post,
      styletag: styleTag,
    });
    await queryRunner.manager.save(newPostStyletag);
  }

  // PostStyletag 삭제 처리
  async deletePostStyletag(
    tagToDelete: PostStyletag,
    queryRunner: QueryRunner,
  ): Promise<void> {
    tagToDelete.status = 'deactivated';
    tagToDelete.softDelete();
    await queryRunner.manager.save(tagToDelete);
  }

  // Post에 연결된 PostStyletag 삭제 처리
  async deletePostStyletagsByPostId(
    postId: number,
    queryRunner: QueryRunner,
  ): Promise<void> {
    const tagsToRemove = await queryRunner.manager.find(PostStyletag, {
      where: { post: { id: postId } },
    });

    await Promise.all(
      tagsToRemove.map(async (tag) => {
        tag.status = 'deactivated';
        tag.softDelete();
        return queryRunner.manager.save(tag);
      }),
    );
  }
}
