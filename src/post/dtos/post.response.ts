import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PostStyletag } from 'src/common/entities/post-styletag.entity';

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

export class PostResponse {
  @ApiProperty({
    example: '게시물 번호',
    description: '게시물 번호입니다.',
  })
  postId: number;

  @ApiProperty({
    example: '작성자 번호',
    description: 'userId',
  })
  userId: number;

  @ApiProperty({
    example: '게시물 내용',
    description: '게시물 내용입니다. 최대 100자까지 입력할 수 있습니다.',
  })
  content: string;

  @ApiProperty({
    type: [PostImageDto],
    description: '게시물에 포함된 이미지 목록입니다.',
  })
  postImages?: PostImageDto[];

  @ApiProperty({
    type: [String],
    example: ['classic', 'basic'],
    description:
      '게시글에 포함된 스타일 태그 목록입니다. 스타일 태그에 저장된 태그만 입력 가능합니다.',
  })
  postStyletags?: string[];

  @ApiProperty({
    type: [PostClothingDto],
    description: '게시물에 포함된 옷 정보 리스트입니다.',
  })
  @Type(() => PostClothingDto)
  postClothings?: PostClothingDto[];

  @ApiProperty({
    example: false,
    description: '대표 게시물 여부입니다.',
  })
  isRepresentative: boolean;
}

export class PostDetailResponse extends PostResponse {
  @ApiProperty({
    example: '2024-10-11T09:00:00.000Z',
    description: '생성 시각',
  })
  createdAt: string;

  @ApiProperty({
    example: '2024-10-11T09:00:00.000Z',
    description: '수정 시각',
  })
  updatedAt: string;

  @ApiProperty({
    example: 'nickname',
    description: '사용자의 닉네임',
  })
  userNickname: string;

  @ApiProperty({
    example: 'http://example.com/image.jpg',
    description: '사용자의 프로필 사진 URL',
  })
  userProfilePictureUrl: string;

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
}
