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

  async findStyleTags(tags: string[]): Promise<Styletag[]> {
    const styleTags = await this.styletagRepository
      .createQueryBuilder('styletag')
      .where('styletag.tag IN (:...tags)', { tags })
      .getMany();

    return styleTags;
  }
}
