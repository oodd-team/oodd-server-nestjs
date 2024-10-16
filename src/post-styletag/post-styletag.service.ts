import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryRunner } from 'typeorm';
import { PostStyletag } from 'src/common/entities/post-styletag.entity';
import { Post } from 'src/common/entities/post.entity';
import { StyletagService } from 'src/styletag/styletag.service';

@Injectable()
export class PostStyletagService {
  constructor(
    @InjectRepository(PostStyletag)
    private readonly postStyletagRepository: Repository<PostStyletag>,
    private readonly styletagService: StyletagService,
  ) {}

  // tag를 styletag, postStyletag에 저장
  async savePostStyletags(
    post: Post,
    tags: string[],
    queryRunner?: QueryRunner,
  ): Promise<void> {
    const savedTags = await this.styletagService.createOrFindTags(tags);

    for (const tag of savedTags) {
      const postStyletag = this.postStyletagRepository.create({
        post,
        styletag: tag,
      });

      try {
        if (queryRunner) {
          // QueryRunner의 manager로 저장
          await queryRunner.manager.save(postStyletag);
        } else {
          await this.postStyletagRepository.save(postStyletag);
        }
      } catch (error) {
        throw new Error('스타일태그 저장에 실패했습니다.');
      }
    }
  }
}
