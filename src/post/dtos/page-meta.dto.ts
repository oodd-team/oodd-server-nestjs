import { IsInt, IsPositive } from 'class-validator';
import { PageMetaDtoParameters } from './meta-dto-parameter.interface';
import { ApiProperty } from '@nestjs/swagger';

export class PageMetaDto {
  @ApiProperty({ description: '총 게시물 수', example: 100 })
  @IsInt()
  @IsPositive()
  readonly total: number;
  @ApiProperty({ description: '현재 페이지 번호', example: 1 })
  @IsInt()
  @IsPositive()
  readonly page: number;
  @ApiProperty({ description: '페이지당 게시물 수', example: 10 })
  @IsInt()
  @IsPositive()
  readonly take: number;
  @ApiProperty({ description: '마지막 페이지 번호', example: 10 })
  @IsInt()
  @IsPositive()
  readonly last_page: number;
  @ApiProperty({ description: '이전 페이지 존재 여부', example: true })
  readonly hasPreviousPage: boolean;
  @ApiProperty({ description: '다음 페이지 존재 여부', example: true })
  readonly hasNextPage: boolean;

  constructor({ pageOptionsDto, total }: PageMetaDtoParameters) {
    this.page = pageOptionsDto.page <= 0 ? 1 : pageOptionsDto.page; // 페이지가 0 이하일 경우 1로 설정
    this.take = pageOptionsDto.take;
    this.total = total;
    this.last_page = Math.ceil(this.total / this.take); // 마지막 페이지 계산
    this.hasPreviousPage = this.page > 1; // 이전 페이지 여부
    this.hasNextPage = this.page < this.last_page; // 다음 페이지 여부
  }
}
