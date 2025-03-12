import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserStyletag } from 'src/common/entities/user-styletag.entity';
import { User } from 'src/common/entities/user.entity';
import { StatusEnum } from 'src/common/enum/entityStatus';
import {
  DataNotFoundException,
  InternalServerException,
} from 'src/common/exception/service.exception';
import { StyletagService } from 'src/styletag/styletag.service';
import { QueryRunner, Repository } from 'typeorm';

@Injectable()
export class UserStyletagService {
  constructor(
    @InjectRepository(UserStyletag)
    private readonly userStyletagRepository: Repository<UserStyletag>,
    private readonly styletagService: StyletagService,
  ) {}

  async saveUserStyletags(
    user: User,
    tags: string[],
    queryRunner: QueryRunner,
  ): Promise<void> {
    if (!tags || tags.length === 0) {
      return;
    }
    // 태그들에 대한 검증 및 스타일 태그 찾기
    const styleTags = await this.styletagService.findStyleTags(tags);

    if (styleTags.length === 0) {
      throw DataNotFoundException('일치하는 스타일 태그가 없습니다.');
    }

    // 기존에 등록된 userStyletag들 조회
    const existingUserStyletags = await queryRunner.manager.find(UserStyletag, {
      where: { user },
      relations: ['styletag'],
    });

    // 삭제할 UserStyletag 찾기
    const newTagIds = styleTags.map((tag) => tag.id);
    const tagsToRemove = existingUserStyletags.filter(
      (existingUserStyletag) =>
        existingUserStyletag.status === StatusEnum.ACTIVATED &&
        !newTagIds.includes(existingUserStyletag.styletag.id),
    );

    // 삭제할 태그가 있으면 비활성화 처리
    if (tagsToRemove.length > 0) {
      await this.deleteUserStyletags(tagsToRemove, queryRunner);
    }

    // 새로운 UserStyletag 추가
    const newUserStyletags: UserStyletag[] = [];
    for (const tag of styleTags) {
      // 중복 체크
      const existingUserStyletag = existingUserStyletags.find(
        (existingTag) => existingTag.styletag.id === tag.id,
      );

      if (existingUserStyletag) {
        // 기존 태그가 비활성화 되어 있으면 활성화
        if (existingUserStyletag.status === StatusEnum.DEACTIVATED) {
          existingUserStyletag.status = StatusEnum.ACTIVATED;
          newUserStyletags.push(existingUserStyletag);
        }
      } else {
        // 새로운 태그 추가
        newUserStyletags.push(
          this.userStyletagRepository.create({
            user,
            styletag: tag,
          }),
        );
      }
    }

    if (newUserStyletags.length > 0) {
      try {
        await queryRunner.manager.save(UserStyletag, newUserStyletags);
      } catch (error) {
        throw InternalServerException(error.message);
      }
    }
  }

  // UserStyletag 삭제
  async deleteUserStyletags(
    tagsToDelete: UserStyletag[],
    queryRunner: QueryRunner,
  ): Promise<void> {
    for (const tag of tagsToDelete) {
      tag.status = StatusEnum.DEACTIVATED;
      await queryRunner.manager.save(tag);
    }
  }
}
