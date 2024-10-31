import { ApiProperty, OmitType } from '@nestjs/swagger';

class PostDto {
  @ApiProperty({
    example: true,
    description: '대표 게시글 여부를 나타냅니다.',
  })
  isRepresentative: boolean;

  @ApiProperty({
    example: '2024-10-21T09:00:00.000Z',
    description: '게시글이 작성된 시간입니다.',
  })
  createdAt: string;

  @ApiProperty({
    example: 'http://imageurl.example',
    description: '게시글의 썸네일 URL입니다.',
  })
  imageUrl: string;

  @ApiProperty({
    example: 10,
    description: '게시글에 달린 댓글 수입니다.',
  })
  commentCount: number;

  @ApiProperty({
    example: 5,
    description: '게시글의 좋아요 수입니다.',
  })
  likeCount: number;

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
}
export class GetMyPostsResponse {
  @ApiProperty({
    type: [PostDto],
    description: '조회된 사용자의 게시글 목록입니다.',
  })
  posts: PostDto[];

  @ApiProperty({
    example: 20,
    description: '사용자의 게시글에 달린 총 댓글 수입니다.',
  })
  totalComments: number;

  @ApiProperty({
    example: 50,
    description: '사용자가 작성한 총 게시글 수입니다.',
  })
  totalPosts: number;

  @ApiProperty({
    example: 100,
    description: '사용자가 받은 총 좋아요 수입니다.',
  })
  totalLikes: number;
}

class OtherUserPostDto extends OmitType(PostDto, [
  'commentCount',
  'isPostComment',
]) {}

export class GetOtherPostsResponse {
  @ApiProperty({
    type: [OtherUserPostDto],
    description: '다른 사용자의 게시글 목록입니다.',
  })
  posts: OtherUserPostDto[];

  @ApiProperty({
    example: 30,
    description: '다른 사용자가 작성한 총 게시글 수입니다.',
  })
  totalPosts: number;

  @ApiProperty({
    example: 200,
    description: '다른 사용자가 받은 총 좋아요 수입니다.',
  })
  totalLikes: number;
}
