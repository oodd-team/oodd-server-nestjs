import { ApiProperty } from '@nestjs/swagger';

class PostImageDto {
  @ApiProperty({
    example: 'http://example.com/image.jpg',
    description: '게시물 이미지 URL',
  })
  imageUrl: string;

  @ApiProperty({
    example: 1,
    description: '이미지의 순서 번호',
  })
  orderNum: number;
}

class PostClothingDto {
  @ApiProperty({
    example: 'http://example.com/clothing.jpg',
    description: '옷 이미지 URL입니다.',
  })
  imageUrl: string;

  @ApiProperty({
    example: '브랜드 이름',
    description: '옷 브랜드 이름입니다.',
  })
  brandName: string;

  @ApiProperty({ example: '모델 이름', description: '옷 상품명입니다.' })
  modelName: string;

  @ApiProperty({ example: '모델 넘버', description: '옷 모델 넘버입니다.' })
  modelNumber: string;

  @ApiProperty({
    example: 'http://example.com/product',
    description: '옷 상품 링크입니다.',
  })
  url: string;
}

class PostStyletagDto {
  @ApiProperty({
    example: 1,
    description: '스타일 태그 id',
  })
  styletagId: number;

  @ApiProperty({
    example: '스타일 태그',
    description: '스타일 태그 내용',
  })
  tag: string;
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
    type: [PostClothingDto],
    description: '게시물에 포함된 옷 정보 목록',
  })
  postClothings: PostClothingDto[];

  @ApiProperty({
    type: UserDto,
    description: '게시물 작성자 정보',
  })
  user: UserDto;

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
    example: false,
    description: '현재 사용자가 게시물에 좋아요를 눌렀는지 여부',
  })
  isPostLike: boolean;

  @ApiProperty({
    example: false,
    description: '현재 사용자가 게시물 작성자인지 여부',
  })
  isPostWriter: boolean;

  @ApiProperty({
    example: true,
    description: '대표 게시물 여부',
  })
  isRepresentative: boolean;

  @ApiProperty({
    type: [PostStyletagDto],
    description: '게시글에 포함된 스타일 태그 목록입니다.',
  })
  postStyletags: PostStyletagDto[];
}

export class GetPostResponse {
  @ApiProperty({
    type: PostDetailDto,
    description: '게시물 상세 정보',
  })
  post: PostDetailDto;
}
