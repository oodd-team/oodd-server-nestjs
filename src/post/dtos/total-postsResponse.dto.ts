import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
class PostImageDto {
  @ApiProperty()
  @IsString()
  url: string;

  @ApiProperty()
  @IsNumber()
  orderNum: number;
}

class PostDto {
  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: [PostImageDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PostImageDto)
  postImages: PostImageDto[];

  @ApiProperty()
  isPostLike: boolean;

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
  isPostWriter: boolean; // 현재 사용자가 게시글 작성자인지 여부
}

export class GetPostsResponse {
  @ApiProperty({ type: [PostDto] })
  post: PostDto[];

  @ApiProperty()
  isMatching: boolean;
}
