import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ example: '댓글 내용' })
  @IsString()
  content: string;
}
