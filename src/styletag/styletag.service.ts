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

  async findStyleTag(tag: string): Promise<Styletag | null> {
    const styleTag = await this.styletagRepository
      .createQueryBuilder('styletag')
      .where('styletag.tag = :...tag', { tag })
      .getOne();

    return styleTag;
  }
}
