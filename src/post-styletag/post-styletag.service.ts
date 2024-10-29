import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async savePostStyletags(post: Post, tags: string[]): Promise<void> {
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
        // postStyletag 저장
        await this.postStyletagRepository.save(postStyletag);
      } catch (error) {
        console.error('Error saving post styletags:', error);
        throw InternalServerException('postStyletag 저장에 실패했습니다.');
      }
    }
  }

  // 스타일 태그 수정
  async updatePostStyletags(post: Post, newTags: string[]): Promise<void> {
    const existingPostStyletags = await this.postStyletagRepository.find({
      where: { post },
      relations: ['styletag'],
    });

    // Styletag 조회
    const styleTags = await this.styletagService.findStyleTags(newTags);

    if (styleTags.length === 0) {
      throw DataNotFoundException('일치하는 스타일 태그가 없습니다.');
    }

    // 삭제할 Styletag
    const newTagIds = styleTags.map((tag) => tag.id);
    const tagsToRemove = existingPostStyletags.filter(
      (existingTag) => !newTagIds.includes(existingTag.styletag.id),
    );

    // Styletag 삭제
    for (const tagToRemove of tagsToRemove) {
      try {
        tagToRemove.status = 'deactivated';
      } catch (error) {
        throw InternalServerException('postStyletag 삭제에 실패했습니다.');
      }
    }

    // 새로운 Styletag 추가
    for (const tag of styleTags) {
      const postStyletag = this.postStyletagRepository.create({
        post,
        styletag: tag,
      });

      try {
        // postStyletag 저장
        await this.postStyletagRepository.save(postStyletag);
      } catch (error) {
        throw InternalServerException('postStyletag 저장에 실패했습니다.');
      }
    }
  }
}
