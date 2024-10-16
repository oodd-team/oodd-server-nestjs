import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class PostImageDto {
  @ApiProperty({ example: 'http://example.com/image.jpg' })
  @IsString()
  url: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  orderNum: number;
}

class UserDto {
  @ApiProperty({ example: 'nickname' })
  @IsString()
  @MaxLength(10)
  nickname: string;

  @ApiProperty()
  @IsString()
  profilePictureUrl: string;
}

class PostDetailDto {
  @ApiProperty({ example: '게시물 내용' })
  @IsString()
  @MaxLength(100)
  content: string;

  @ApiProperty({ example: '2024-10-11T09:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ type: [PostImageDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PostImageDto)
  postImages: PostImageDto[];

  @ApiProperty({ type: UserDto })
  user: UserDto;

  @ApiProperty({ example: false })
  @IsBoolean()
  isPostLike: boolean;

  @ApiProperty()
  @IsBoolean()
  isPostWriter: boolean;
}

export class GetPostResponse {
  @ApiProperty({ type: PostDetailDto })
  post: PostDetailDto;
}
