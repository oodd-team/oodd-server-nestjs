import { IsArray } from 'class-validator';
import { PageMetaDto } from './page-meta.dto';
import { ApiProperty } from '@nestjs/swagger';
import { GetPostsResponse } from './total-postsResponse.dto';
import {
  GetMyPostsResponse,
  GetOtherPostsResponse,
} from './user-postsResponse.dto';

export class PageDto<T> {
  @ApiProperty({
    description: '실제 데이터',
    type: [GetPostsResponse, GetMyPostsResponse, GetOtherPostsResponse],
  })
  @IsArray()
  readonly data: T[]; // 실제 데이터

  @ApiProperty({ description: '페이지 메타 정보', type: PageMetaDto })
  readonly meta: PageMetaDto; // 메타 정보

  constructor(data: T[], meta: PageMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
