import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Styletag } from 'src/common/entities/styletag.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StyletagService {
  constructor(
    @InjectRepository(Styletag)
    private readonly styletagRepository: Repository<Styletag>,
  ) {}

  async createOrFindTags(tags: string[]): Promise<Styletag[]> {
    const existingTags = await this.styletagRepository.find({
      where: tags.map((tag) => ({ tag })),
    });

    const newTags = tags
      .filter(
        (tag) => !existingTags.some((existingTag) => existingTag.tag === tag),
      )
      .map((tag) => this.styletagRepository.create({ tag }));

    await this.styletagRepository.save(newTags);

    return [...existingTags, ...newTags];
  }
}
