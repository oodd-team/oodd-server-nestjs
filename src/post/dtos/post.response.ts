import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { UploadClothingDto, UploadImageDto } from './create-post.request';

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
    example: '2024-10-11T09:00:00.000Z',
    description: '작성 시각',
  })
  createdAt: string;

  @ApiProperty({
    example: '게시물 내용',
    description: '게시물 내용입니다. 최대 100자까지 입력할 수 있습니다.',
  })
  content: string;

  @ApiProperty({
    type: [UploadImageDto],
    description: '게시물에 포함된 이미지 목록입니다.',
  })
  @Type(() => UploadImageDto)
  postImages?: UploadImageDto[];

  @ApiProperty({
    type: [String],
    example: ['classic'],
    description:
      '게시글에 포함된 스타일 태그 목록입니다. 스타일 태그에 저장된 태그만 입력 가능합니다.',
  })
  postStyletags?: string[];

  @ApiProperty({
    type: [UploadClothingDto],
    description: '게시물에 포함된 옷 정보 리스트입니다.',
  })
  @Type(() => UploadClothingDto)
  postClothings?: UploadClothingDto[];

  @ApiProperty({
    example: false,
    description: '대표 게시물 여부입니다.',
  })
  isRepresentative: boolean;
}
