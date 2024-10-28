import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async savePostStyletags(post: Post, tags: string[]): Promise<void> {
    // 스타일태그 조회
    const styleTags = await this.styletagService.findStyleTags(tags);

    for (const tag of styleTags) {
      const postStyletag = this.postStyletagRepository.create({
        post,
        styletag: tag,
      });

      try {
        // postStyletag 저장
        await this.postStyletagRepository.save(postStyletag);
      } catch (error) {
        throw new Error('postStyletag 저장에 실패했습니다.');
      }
    }
  }
}
