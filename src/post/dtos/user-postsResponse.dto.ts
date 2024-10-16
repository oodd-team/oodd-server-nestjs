import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsInt, IsString } from 'class-validator';

class PostDto {
  @ApiProperty()
  @IsBoolean()
  isRepresentative: boolean;

  @ApiProperty()
  @IsDate()
  createdAt: Date;

  @ApiProperty()
  @IsString()
  imageUrl: string;

  @ApiProperty()
  @IsInt()
  commentCount: number;

  @ApiProperty()
  @IsInt()
  likeCount: number;

  @ApiProperty()
  @IsBoolean()
  isPostLike: boolean;

  @ApiProperty()
  @IsBoolean()
  isPostComment: boolean;
}
export class GetMyPostsResponse {
  @ApiProperty({ type: [PostDto] })
  posts: PostDto[];

  @ApiProperty()
  @IsInt()
  totalComments: number;

  @ApiProperty()
  @IsInt()
  totalPosts: number;

  @ApiProperty()
  @IsInt()
  totalLikes: number;
}

class OtherUserPostDto extends OmitType(PostDto, [
  'commentCount',
  'isPostComment',
]) {}

export class GetOtherPostsResponse {
  @ApiProperty({ type: [OtherUserPostDto] })
  posts: OtherUserPostDto[];

  @ApiProperty()
  @IsInt()
  totalPosts: number;

  @ApiProperty()
  @IsInt()
  totalLikes: number;
}
