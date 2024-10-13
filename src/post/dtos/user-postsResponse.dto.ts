import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { PostComment } from 'src/common/entities/post-comment.entity';
import { Type } from 'class-transformer';

class PostCommentDto extends PickType(PostComment, [
  'content',
  'createdAt',
  'user',
]) {}

class PostDto {
  @ApiProperty({ example: false })
  isRepresentative: boolean;

  @ApiProperty({ example: '2024-10-11T09:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: 'http://example.com/image.jpg' })
  @IsString()
  imageUrl: string;

  @ApiProperty({ type: [PostCommentDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PostCommentDto)
  comments: PostCommentDto[];

  @ApiProperty({ example: 1 })
  @IsNumber()
  likeCount: number;

  @ApiProperty({ example: false })
  isPostLike: boolean;

  @ApiProperty({ example: false })
  isPostComment: boolean;
}
export class GetMyPostsResponse {
  @ApiProperty({ type: [PostDto] })
  posts: PostDto[];

  @ApiProperty({ example: 0 })
  @IsNumber()
  totalComments: number;

  @ApiProperty({ example: 0 })
  @IsNumber()
  totalPosts: number;

  @ApiProperty({ example: 0 })
  @IsNumber()
  totalLikes: number;
}

class OtherUserPostDto extends OmitType(PostDto, [
  'comments',
  'isPostComment',
]) {}

export class GetOtherPostsResponse {
  @ApiProperty({ type: [OtherUserPostDto] })
  posts: OtherUserPostDto[];

  @ApiProperty({ example: 0 })
  @IsNumber()
  totalPosts: number;

  @ApiProperty({ example: 0 })
  @IsNumber()
  totalLikes: number;
}
