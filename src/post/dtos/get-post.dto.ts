import { ApiProperty } from '@nestjs/swagger';

class PostImageDto {
  @ApiProperty({
    example: 'http://example.com/image.jpg',
    description: '게시물 이미지 URL',
  })
  url: string;

  @ApiProperty({
    example: 1,
    description: '이미지의 순서 번호',
  })
  orderNum: number;
}

class UserDto {
  @ApiProperty({
    example: '1',
    description: '사용자 id',
  })
  userId: number;

  @ApiProperty({
    example: 'nickname',
    description: '사용자의 닉네임',
  })
  nickname: string;

  @ApiProperty({
    example: 'http://example.com/image.jpg',
    description: '사용자의 프로필 사진 URL',
  })
  profilePictureUrl: string;
}

class PostDetailDto {
  @ApiProperty({
    example: '게시물 내용',
    description: '게시물의 내용',
  })
  content: string;

  @ApiProperty({
    example: '2024-10-11T09:00:00.000Z',
    description: '게시물이 생성된 날짜 및 시간',
  })
  createdAt: Date;

  @ApiProperty({
    type: [PostImageDto],
    description: '게시물에 포함된 이미지 목록',
  })
  postImages: PostImageDto[];

  @ApiProperty({
    type: UserDto,
    description: '게시물 작성자 정보',
  })
  user: UserDto;

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
    example: false,
    description: '현재 사용자가 게시물에 좋아요를 눌렀는지 여부',
  })
  isPostLike: boolean;

  @ApiProperty({
    example: false,
    description: '현재 사용자가 게시물 작성자인지 여부',
  })
  isPostWriter: boolean;
}

export class GetPostResponse {
  @ApiProperty({
    type: PostDetailDto,
    description: '게시물 상세 정보',
  })
  post: PostDetailDto;
}
