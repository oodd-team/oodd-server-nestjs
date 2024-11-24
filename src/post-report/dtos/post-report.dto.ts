import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, MinLength } from 'class-validator';

export class PostReportDto {
  @ApiProperty({ example: 1, description: '신고하는 사용자 ID' })
  @IsNumber()
  requesterId!: number;

  @ApiProperty({ example: 3, description: '신고할 게시글 ID' })
  @IsNumber()
  postId!: number;

  @ApiProperty({ example: '윽 이상한 글', description: '신고 사유' })
  @IsString()
  @MinLength(5)
  reason!: string;
}
