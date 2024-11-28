import { ApiProperty } from '@nestjs/swagger';
import dayjs from 'dayjs';
import { Post } from 'src/common/entities/post.entity';
import { PostImage } from 'src/common/entities/post-image.entity';

class PostImageDto {
  @ApiProperty({
    example: 'http://postimageurl.example',
    description: '게시물에 첨부된 이미지의 URL입니다.',
  })
  imageUrl: string;

  @ApiProperty({
    example: 1,
    description: '이미지의 순서를 나타내는 번호입니다.',
  })
  orderNum: number;

  constructor(postImage: PostImage) {
    this.imageUrl = postImage.url;
    this.orderNum = postImage.orderNum;
  }
}

class UserDto {
  @ApiProperty({
    example: 19,
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

  constructor(user: any) {
    this.userId = user.id;
    this.nickname = user.nickname;
    this.profilePictureUrl = user.profilePictureUrl;
  }
}

export class PostDto {
  @ApiProperty({
    example: 3,
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

  constructor(post: Post, currentUserId: number) {
    this.postId = post.id;
    this.content = post.content;
    this.createdAt = dayjs(post.createdAt).format('YYYY-MM-DDTHH:mm:ssZ');
    this.postImages =
      post.postImages?.map((image) => new PostImageDto(image)) || [];
    this.isPostLike =
      post.postLikes?.some((like) => like.user.id === currentUserId) || false;
    this.user = new UserDto(post.user);
  }
}

export class GetAllPostsResponse {
  @ApiProperty({
    type: [PostDto],
    description: '조회된 게시글 목록입니다.',
  })
  post: PostDto[];

  constructor(posts: Post[], currentUserId: number) {
    this.post = posts.map((post) => new PostDto(post, currentUserId));
  }
}
