import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    example: '댓글 내용',
    description: '댓글 내용입니다. 최대 100자입니다.',
  })
  @IsString()
  @MaxLength(100)
  content: string;
}
