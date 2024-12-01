import { ApiProperty, PickType } from '@nestjs/swagger';
import { PostImage } from 'src/common/entities/post-image.entity';
import { Post } from 'src/common/entities/post.entity';
import { User } from 'src/common/entities/user.entity';

// 게시물 작성자 정보를 위한 DTO
export class UserDto extends PickType(User, [
  'id',
  'nickname',
  'profilePictureUrl',
]) {
  constructor(user: UserDto) {
    super();
    this.id = user.id;
    this.nickname = user.nickname;
    this.profilePictureUrl = user.profilePictureUrl;
  }
}

// 게시물 이미지 정보를 위한 DTO
export class PostImageDto extends PickType(PostImage, [
  'id',
  'url',
  'orderNum',
]) {
  constructor(postImage: PostImage) {
    super();
    this.id = postImage.id;
    this.url = postImage.url;
    this.orderNum = postImage.orderNum;
  }
}

// 각 게시물 정보 DTO
export class GetAllPostDto extends PickType(Post, ['id', 'content']) {
  @ApiProperty({ type: UserDto })
  user: UserDto; // 유저 정보

  @ApiProperty({
    type: String,
    description: '게시물 작성 시간',
    example: '2021-08-31T00:00:00Z',
  })
  createdAt: string; // 게시물 작성 시간

  @ApiProperty({ type: PostImageDto, isArray: true })
  postImages: PostImageDto[]; // 게시물 이미지

  @ApiProperty({
    type: [Number],
    description: '좋아요 IDs',
    example: [1, 2, 3],
  })
  postLikesUserIds: number[]; // 좋아요 목록
}
