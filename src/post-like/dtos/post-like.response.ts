import { ApiProperty } from '@nestjs/swagger';

export class PostLikeResponseDto {
  @ApiProperty({ example: 28 })
  id!: number;

  @ApiProperty({ example: 8, description: '좋아요를 누른 유저ID'})
  userId!: number;

  @ApiProperty({ example: 78 })
  postId!: number;

  @ApiProperty({ example: '2024-08-13T06:59:09.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: 'activated', description: '좋아요 누르기/취소 여부' })
  status!: 'activated' | 'deactivated';

  @ApiProperty({ example: '2024-08-13T08:16:28.000Z' })
  updatedAt!: Date;
}
