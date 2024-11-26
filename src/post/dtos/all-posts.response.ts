import { ApiProperty } from '@nestjs/swagger';

class PostImageDto {
  @ApiProperty({
    example: 'http://postimageurl.example',
    description: '게시물에 첨부된 이미지의 URL입니다.',
  })
  url: string;

  @ApiProperty({
    example: 1,
    description: '이미지의 순서를 나타내는 번호입니다.',
  })
  orderNum: number;
}

class UserDto {
  @ApiProperty({
    example: '19',
    description: '작성자의 user ID 입니다.',
  })
  userId: number;

  @ApiProperty({
    example: 'nickname',
    description: '작성자의 닉네임입니다.',
  })
  nickname: string;

  @ApiProperty({
    example: 'http://profilepictureurl.example',
    description: '작성자의 프로필 사진 URL입니다.',
  })
  profilePictureUrl: string;
}

export class PostDto {
  @ApiProperty({
    example: '3',
    description: '게시글의 번호입니다.',
  })
  postId: number;

  @ApiProperty({
    example: '게시글 내용 content',
    description: '게시글의 내용입니다.',
  })
  content: string;

  @ApiProperty({
    example: '2024-10-21T09:00:00.000Z',
    description: '게시글이 작성된 시간입니다.',
  })
  createdAt: string;

  @ApiProperty({
    type: [PostImageDto],
    description: '게시글에 첨부된 이미지 목록입니다.',
  })
  postImages: PostImageDto[];

  @ApiProperty({
    example: true,
    description: '현재 사용자가 게시글에 좋아요를 눌렀는지 여부입니다.',
  })
  isPostLike: boolean;

  @ApiProperty({
    type: UserDto,
    description: '게시글 작성자의 정보입니다.',
  })
  user: UserDto;
}

export class GetAllPostsResponse {
  @ApiProperty({
    type: [PostDto],
    description: '조회된 게시글 목록입니다.',
  })
  post: PostDto[];
}
