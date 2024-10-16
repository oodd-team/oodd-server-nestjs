import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ example: '댓글 내용' })
  @IsString()
  @MaxLength(100)
  content: string;
}
