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

  // tag를 styletag에 저장, postStyletag에 저장
  async savePostStyletags(post: Post, tags: string[]): Promise<void> {
    const savedTags = await this.styletagService.createOrFindTags(tags);

    for (const tag of savedTags) {
      const postStyletag = this.postStyletagRepository.create({
        post,
        styletag: tag,
      });
      await this.postStyletagRepository.save(postStyletag);
    }
  }
}
