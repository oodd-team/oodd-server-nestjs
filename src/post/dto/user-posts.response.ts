import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { Post } from 'src/common/entities/post.entity';

export class PostDto extends PickType(Post, [
  'id',
  'isRepresentative',
  'createdAt',
]) {
  @ApiProperty({
    example: 'http://imageurl.example',
    description: '게시글의 썸네일 URL입니다.',
  })
  imageUrl: string;

  @ApiProperty({
    example: 10,
    description: '게시글에 달린 댓글 수입니다.',
  })
  postCommentsCount: number;

  @ApiProperty({
    example: 5,
    description: '게시글의 좋아요 수입니다.',
  })
  postLikesCount: number;

  @ApiProperty({
    example: true,
    description: '현재 사용자가 게시글에 좋아요를 눌렀는지 여부입니다.',
  })
  isPostLike: boolean;

  @ApiProperty({
    example: true,
    description: '현재 사용자가 게시글에 댓글을 작성했는지 여부입니다.',
  })
  isPostComment: boolean;

  constructor(post: Post, currentUserId: number) {
    super();
    this.id = post.id;
    this.isRepresentative = post.isRepresentative;
    this.createdAt = post.createdAt;
    this.imageUrl = post.postImages?.[0]?.url || '';
    this.postCommentsCount = post.postComments?.length || 0;
    this.postLikesCount = post.postLikes?.length || 0;
    this.isPostLike =
      post.postLikes?.some(
        (like) => like.user && like.user.id === currentUserId,
      ) || false;
    this.isPostComment =
      post.postComments?.some(
        (comment) => comment.user && comment.user.id === currentUserId,
      ) || false;
  }
}

export class GetMyPostsResponse {
  @ApiProperty({
    type: [PostDto],
    description: '조회된 사용자의 게시글 목록입니다.',
  })
  post: PostDto[];

  @ApiProperty({
    example: 20,
    description: '사용자의 게시글에 달린 총 댓글 수입니다.',
  })
  totalPostCommentsCount: number;

  @ApiProperty({
    example: 50,
    description: '사용자가 작성한 총 게시글 수입니다.',
  })
  totalPostsCount: number;

  @ApiProperty({
    example: 100,
    description: '사용자가 받은 총 좋아요 수입니다.',
  })
  totalPostLikesCount: number;
}
export class GetOtherPostsResponse extends OmitType(GetMyPostsResponse, [
  'totalPostCommentsCount',
]) {}
