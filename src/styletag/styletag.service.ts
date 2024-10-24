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
    // 입력된 태그들과 일치하는 스타일태그를 모두 조회
    const styleTags = await this.styletagRepository
      .createQueryBuilder('styletag')
      .where('styletag.name IN (:...tags)', { tags })
      .getMany();

    return styleTags;
  }
}
