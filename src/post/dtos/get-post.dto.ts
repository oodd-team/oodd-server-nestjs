import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class PostImageDto {
  @ApiProperty({ example: 'http://example.com/image.jpg' })
  @IsString()
  url: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  orderNum: number;
}

class PostDetailDto {
  @ApiProperty({ example: '게시물 내용' })
  @IsString()
  content: string;

  @ApiProperty({ example: '2024-10-11T09:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ type: [PostImageDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PostImageDto)
  postImages: PostImageDto[];

  @ApiProperty({ example: false })
  isPostLike: boolean;
}

export class GetPostResponse {
  @ApiProperty({ type: PostDetailDto })
  post: PostDetailDto;

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
}
