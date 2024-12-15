import { ApiProperty } from '@nestjs/swagger';

export class PostLikeResponseDto {
  @ApiProperty({
    example: 1,
    description: '좋아요 누른 POST의 아이디',
  })
  id!: number;

  @ApiProperty({
    example: 1,
    description: '포스트에 좋아요 눌렀는지 여부',
  })
  isPostLike: boolean;

  @ApiProperty({
    example: 1,
    description: '좋아요 개수',
  })
  postLikesCount: number;
}
