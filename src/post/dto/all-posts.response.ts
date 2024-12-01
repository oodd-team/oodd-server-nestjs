import { ApiProperty } from '@nestjs/swagger';
import dayjs from 'dayjs';
import { GetAllPostDto, UserDto } from './dto/get-all-posts.dto';
import { MatchingRequestStatusEnum } from '../../common/enum/matchingRequestStatus';
import { Matching } from 'src/common/entities/matching.entity';

export class PostDto extends GetAllPostDto {
  @ApiProperty({
    description: '게시글에 좋아요 눌렀는지 여부입니다.',
    example: true,
  })
  isPostLike: boolean;

  @ApiProperty({
    required: false,
    enum: MatchingRequestStatusEnum,
    description: '매칭 요청 상태입니다.',
  })
  requestStatus?: MatchingRequestStatusEnum | null;

  constructor(
    post: GetAllPostDto,
    currentUserId: number,
    requestStatus?: MatchingRequestStatusEnum | null,
  ) {
    super();
    this.id = post.id;
    this.content = post.content;
    this.createdAt = dayjs(post.createdAt).format('YYYY-MM-DDTHH:mm:ssZ');
    this.postImages = post.postImages ?? [];
    this.isPostLike =
      post.postLikesUserIds?.some((like) => like === currentUserId) || false;
    this.requestStatus = requestStatus;
    this.user = new UserDto(post.user);
  }
}

export class GetAllPostsResponse {
  @ApiProperty({
    type: [PostDto],
    description: '조회된 게시글 목록입니다.',
  })
  post: PostDto[];

  constructor(
    posts: GetAllPostDto[],
    currentUserId: number,
    matchings?: Matching[],
  ) {
    this.post = posts.map((post) => {
      const matching = matchings?.find(
        (matching) =>
          matching.requester.id === post.user.id ||
          matching.target.id === post.user.id,
      );
      return new PostDto(post, currentUserId, matching?.requestStatus ?? null);
    });
  }
}
