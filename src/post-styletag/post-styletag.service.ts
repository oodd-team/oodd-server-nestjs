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

  async savePostStyletags(
    post: Post,
    tags: string[],
    queryRunner: QueryRunner,
  ): Promise<void> {
    if (!tags || tags.length === 0) {
      return;
    }

    // Styletag 조회
    const styleTags = await this.styletagService.findStyleTags(tags);

    if (styleTags.length === 0) {
      throw DataNotFoundException('일치하는 스타일 태그가 없습니다.');
    }

    for (const tag of styleTags) {
      // 중복 검사
      const existingPostStyletag = await this.postStyletagRepository.findOne({
        where: { post, styletag: tag },
      });

      if (existingPostStyletag) {
        throw InvalidInputValueException(`중복된 스타일 태그: ${tag.tag}`);
      }
    }

    for (const tag of styleTags) {
      const postStyletag = this.postStyletagRepository.create({
        post,
        styletag: tag,
      });

      try {
        await queryRunner.manager.save(postStyletag);
      } catch (error) {
        throw InternalServerException('postStyletag 저장에 실패했습니다.');
      }
    }
  }

  // 스타일 태그 수정
  async updatePostStyletags(
    post: Post,
    newTags: string[],
    queryRunner?: QueryRunner,
  ): Promise<void> {
    const existingPostStyletags = await this.postStyletagRepository.find({
      where: { post },
      relations: ['styletag'],
    });

    // 빈 배열이 들어온 경우
    if (newTags.length === 0) {
      const tagsToDelete = existingPostStyletags.filter(
        (existingPostStyletag) => existingPostStyletag.status === 'activated',
      );

      await this.deletePostStyletags(tagsToDelete, queryRunner);
      return; // 함수 종료
    }

    // Styletag 조회
    const styleTags = await this.styletagService.findStyleTags(newTags);

    if (styleTags.length === 0) {
      throw DataNotFoundException('일치하는 스타일 태그가 없습니다.');
    }

    // 삭제할 PostStyletag
    const newTagIds = styleTags.map((tag) => tag.id);
    const tagsToRemove = existingPostStyletags.filter(
      (existingTag) =>
        existingTag.status === 'activated' &&
        !newTagIds.includes(existingTag.styletag.id),
    );

    // PostStyletag 삭제
    if (tagsToRemove.length > 0) {
      await this.deletePostStyletags(tagsToRemove, queryRunner);
    }

    // 새로운 PostStyletag 추가
    const newPostStyletags = [];
    for (const tag of styleTags) {
      // 태그 중복 검사
      const existingPostStyletag = existingPostStyletags.find(
        (existingTag) => existingTag.styletag.id === tag.id,
      );

      if (existingPostStyletag) {
        // 기존 태그가 있을 경우
        if (existingPostStyletag.status === 'deactivated') {
          // 상태가 'deactivated'인 경우, 'activated'로 변경
          existingPostStyletag.status = 'activated';
          await queryRunner.manager.save(existingPostStyletag);
        }
      } else {
        // 새로운 태그 중복 검사
        if (!newPostStyletags.some((newTag) => newTag.tag === tag.tag)) {
          newPostStyletags.push(
            this.postStyletagRepository.create({
              post,
              styletag: tag,
            }),
          );
        } else {
          throw InvalidInputValueException(`중복된 스타일 태그: ${tag.tag}`);
        }
      }
    }
    if (newPostStyletags.length > 0) {
      await queryRunner.manager.save(newPostStyletags);
    }
  }
  // PostStyletag 삭제 처리
  async deletePostStyletags(
    tagsToDeleye: PostStyletag[],
    queryRunner?: QueryRunner,
  ): Promise<void> {
    for (const tag of tagsToDeleye) {
      tag.status = 'deactivated';
      tag.softDelete();
    }
    await queryRunner.manager.save(tagsToDeleye);
  }
}
