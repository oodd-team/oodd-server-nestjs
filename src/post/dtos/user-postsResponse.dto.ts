import { OmitType, PickType } from '@nestjs/swagger';
import { PostComment } from 'src/common/entities/post-comment.entity';

class PostDto {
  postId: number;
  isRepresentative: boolean;
  createdAt: Date;
  image: string;
  comments: PostCommentDto[];
  likeCount: number;
  isPostLike: boolean;
  isPostComment: boolean;
}
export class GetMyPostsResponse {
  posts: PostDto[];
  totalComments: number;
  totalPosts: number;
  totalLikes: number;
}

export class GetOtherPostsResponse {
  posts: OtherUserPostDto[];
  totalPosts: number;
  totalLikes: number;
}

class OtherUserPostDto extends OmitType(PostDto, ['comments']) {}

class PostCommentDto extends PickType(PostComment, [
  'content',
  'createdAt',
  'user',
]) {}
