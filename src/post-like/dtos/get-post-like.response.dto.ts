import { ApiProperty } from '@nestjs/swagger';
import { PostLikeResponseDto } from './post-like.response';

export class GetPostLikesResponseDto {
  @ApiProperty({ example: 3 })
  totalLikes!: number;

  @ApiProperty({ type: [PostLikeResponseDto] })
  likes!: PostLikeResponseDto[];
}
