import { ApiProperty, PickType } from '@nestjs/swagger';
import { PatchPostRequest } from './patch-post.request';

export class PatchPostResponse extends PickType(PatchPostRequest, [
  'content',
  'postImages',
  'postStyletags',
  'postClothings',
  'isRepresentative',
] as const) {
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
    example: '2024-10-11T09:00:00.000Z',
    description: '수정 시각',
  })
  updatedAt: string;
}
