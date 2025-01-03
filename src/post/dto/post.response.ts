import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import dayjs from 'dayjs';
import { PostClothing } from 'src/common/entities/post-clothing.entity';
import { PostImage } from 'src/common/entities/post-image.entity';
import { Post } from 'src/common/entities/post.entity';
import { User } from 'src/common/entities/user.entity';

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

  constructor(postImage: PostImage) {
    this.url = postImage.url;
    this.orderNum = postImage.orderNum;
  }
}

class UserDto {
  @ApiProperty({
    example: 1,
    description: 'userId',
  })
  id: number;

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

  constructor(user: User) {
    this.id = user.id;
    this.nickname = user.nickname;
    this.profilePictureUrl = user.profilePictureUrl;
  }
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

  constructor(postClothing: PostClothing) {
    this.imageUrl = postClothing.clothing.imageUrl;
    this.brandName = postClothing.clothing.brandName;
    this.modelName = postClothing.clothing.modelName;
    this.modelNumber = postClothing.clothing.modelNumber;
    this.url = postClothing.clothing.url;
  }
}

export class PostResponse {
  @ApiProperty({
    example: 1,
    description: '게시물 번호입니다.',
  })
  id: number;

  @ApiProperty({
    example: 1,
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

  constructor(post: Post) {
    this.userId = post.user.id;
    this.id = post.id;
    this.content = post.content;
    this.isRepresentative = post.isRepresentative;
    this.postImages =
      post.postImages?.map((image) => new PostImageDto(image)) || [];
    this.postStyletags =
      post.postStyletags?.map((postStyleTag) => postStyleTag.styletag.tag) ||
      [];
    this.postClothings =
      post.postClothings?.map((clothing) => new PostClothingDto(clothing)) ||
      [];
  }
}
export class PostDetailResponse {
  @ApiProperty({
    example: 1,
    description: '게시물 번호입니다.',
  })
  id: number;

  @ApiProperty({
    type: UserDto,
    description: '게시물 작성자 정보입니다.',
  })
  @Type(() => UserDto)
  user: UserDto;

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
  constructor(post: Post, currentUserId: number) {
    this.id = post.id;
    this.content = post.content;
    this.isRepresentative = post.isRepresentative;
    this.postImages =
      post.postImages?.map((image) => new PostImageDto(image)) || [];
    this.postStyletags =
      post.postStyletags?.map((postStyleTag) => postStyleTag.styletag.tag) ||
      [];
    this.postClothings =
      post.postClothings?.map((clothing) => new PostClothingDto(clothing)) ||
      [];
    (this.createdAt = dayjs(post.createdAt).format('YYYY-MM-DDTHH:mm:ssZ')),
      (this.updatedAt = dayjs(post.updatedAt).format('YYYY-MM-DDTHH:mm:ssZ')),
      (this.user = new UserDto(post.user));
    this.postCommentsCount = post.postComments?.length || 0;
    this.postLikesCount = post.postLikes?.length || 0;
    this.isPostLike =
      post.postLikes?.some((like) => like.user.id === currentUserId) || false;
  }
}
