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

export class CreateCommentResponseDto {
  @ApiProperty({
    example: '댓글 내용',
    description: '작성된 댓글 내용',
  })
  content: string;

  @ApiProperty({
    example: 1,
    description: '작성자 ID',
  })
  userId: number;

  @ApiProperty({
    example: 19,
    description: '게시글 ID',
  })
  postId: number;

  @ApiProperty({
    example: '2024-10-28T11:24:35.000Z',
    description: '댓글 작성 시간',
  })
  createdAt: Date;
}
