import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class PageOptionsDto {
  @ApiProperty({
    example: '1',
    description: '페이지 번호',
  })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  @Min(1) // 페이지는 1 이상
  page?: number;

  @ApiProperty({
    example: '10',
    description: '한 페이지에 불러올 데이터 개수',
  })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  take?: number;

  // 기본값 설정
  constructor() {
    this.page = this.page || 1;
    this.take = this.take || 10;
  }
}
