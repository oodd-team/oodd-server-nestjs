import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

class CommentDto {
  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({
    properties: {
      nickname: { type: 'string' },
      profilePictureUrl: { type: 'string' },
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
  post: CommentDto[];

  @ApiProperty()
  @IsNumber()
  totalComments: number;
}
