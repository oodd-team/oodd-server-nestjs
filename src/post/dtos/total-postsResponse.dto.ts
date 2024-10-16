import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsInt,
  IsString,
  Max,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
class PostImageDto {
  @ApiProperty()
  @IsString()
  url: string;

  @ApiProperty()
  @IsInt()
  @Max(10)
  orderNum: number;
}

class UserDto {
  @ApiProperty()
  @IsString()
  @MaxLength(10)
  nickname: string;

  @ApiProperty()
  @IsString()
  profilePictureUrl: string;
}

class PostDto {
  @ApiProperty()
  @IsString()
  @MaxLength(100)
  content: string;

  @ApiProperty()
  @IsDate()
  createdAt: Date;

  @ApiProperty({ type: [PostImageDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PostImageDto)
  postImages: PostImageDto[];

  @ApiProperty()
  @IsBoolean()
  isPostLike: boolean;

  @ApiProperty({ type: UserDto })
  user: UserDto;

  @ApiProperty()
  @IsBoolean()
  isPostWriter: boolean; // 현재 사용자가 게시글 작성자인지 여부
}

export class GetPostsResponse {
  @ApiProperty({ type: [PostDto] })
  post: PostDto[];

  @ApiProperty()
  @IsBoolean()
  isMatching: boolean = false;
}
