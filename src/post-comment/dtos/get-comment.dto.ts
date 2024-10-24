import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

class CommentDto {
  @ApiProperty({ example: '댓글 내용' })
  @IsString()
  content: string;

  @ApiProperty({ example: '2024-10-04 17:49:53' })
  createdAt: Date;

  @ApiProperty({
    properties: {
      nickname: { type: 'string', example: '닉넴' },
      profilePictureUrl: { type: 'string', example: 'profilePictureUrl.jpeg' },
    },
  })
  user: {
    nickname: string;
    profilePictureUrl: string;
  };

  @ApiProperty()
  @IsBoolean()
  isCommentWriter: boolean; // 현재 사용자가 댓글 작성자인지 여부
}

export class GetCommentsDto {
  @ApiProperty({ type: [CommentDto] })
  comments: CommentDto[];

  @ApiProperty({ example: '10' })
  @IsBoolean()
  totalComments: number;
}
