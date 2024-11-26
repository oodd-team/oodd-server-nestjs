import { ApiProperty, PickType } from '@nestjs/swagger';
import { PostLike } from 'src/common/entities/post-like.entity';
import { User } from 'src/common/entities/user.entity';
import { PageMetaDto } from 'src/common/response/page-meta.dto';

export class GetPostLikesResponseDto {
  @ApiProperty({
    example: 2,
    description: '전체 좋아요 개수',
  })
  totalCount: number;

  @ApiProperty({
    example: [
      {
        id: 1,
        user: {
          id: 1,
          email: 'limms1217@naver.com',
          profilePictureUrl: 'https://cdn.sweettracker.net/user_profile.png',
          nickname: 'limms1217',
        },
        createdAt: '2021-08-31T08:00:00.000Z',
      },
    ],
    description: '좋아요 리스트',
    type: [Object],
  })
  likes: PostLikeDto[]; // 적절한 타입으로 수정

  @ApiProperty({
    example: {
      page: 1,
      take: 10,
      total: 1,
      last_page: 1,
      hasPreviousPage: false,
      hasNextPage: false,
    },
    description: '페이지 메타 정보',
    type: Object,
  }) // 페이지 메타 정보 추가
  meta: PageMetaDto; // 페이지 메타 정보 추가

  constructor(totalLikes: number, likes: any[], meta: PageMetaDto) {
    this.totalCount = totalLikes;
    this.likes = likes;
    this.meta = meta;
  }
}

class PostLikedUser extends PickType(User, [
  'id',
  'email',
  'profilePictureUrl',
  'nickname',
]) {}

export class PostLikeDto extends PickType(PostLike, ['id', 'createdAt']) {
  user: PostLikedUser;
}
