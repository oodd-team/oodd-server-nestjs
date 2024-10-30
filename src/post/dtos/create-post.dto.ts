import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  IsNumber,
  ValidateNested,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UploadImageDto {
  @ApiProperty({
    example: 'http://example.com/image.jpg',
    description: '업로드할 이미지의 URL입니다.',
  })
  @IsString()
  imageurl: string;

  @ApiProperty({ example: 1, description: '이미지의 순서 번호입니다.' })
  @IsNumber()
  orderNum: number;
}

export class UploadClothingDto {
  @ApiProperty({
    example: 'http://example.com/clothing.jpg',
    description: '업로드할 옷 정보 URL입니다.',
  })
  @IsString()
  imageUrl: string;

  @ApiProperty({
    example: '브랜드 이름',
    description: '옷 브랜드 이름입니다.',
  })
  @IsString()
  @MaxLength(100)
  brandName: string;

  @ApiProperty({ example: '모델 이름', description: '옷 상품명입니다.' })
  @IsString()
  @MaxLength(100)
  modelName: string;

  @ApiProperty({ example: '모델 넘버', description: '옷 모델 넘버입니다.' })
  @IsString()
  @MaxLength(100)
  modelNumber: string;

  @ApiProperty({
    example: 'http://example.com/product',
    description: '옷 상품 링크입니다.',
  })
  @IsString()
  url: string;
}

export class CreatePostDto {
  @ApiProperty({
    example: '게시물 내용',
    description: '게시물 내용입니다. 최대 100자까지 입력할 수 있습니다.',
  })
  @IsString()
  @MaxLength(100)
  content: string;

  @ApiProperty({
    type: [UploadImageDto],
    description: '게시물에 포함될 이미지 목록입니다.',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UploadImageDto)
  postImages?: UploadImageDto[];

  @ApiProperty({
    required: false,
    type: [String],
    example: ['가을'],
    description: '스타일 태그 목록입니다.',
  })
  @IsOptional()
  @IsArray()
  @MaxLength(20, { each: true })
  postStyletags?: string[];

  @ApiProperty({
    required: false,
    type: [UploadClothingDto],
    description: '게시물에 포함될 옷 정보 리스트입니다.',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UploadClothingDto)
  postClothings?: UploadClothingDto[];

  @ApiProperty({
    example: false,
    description: '대표 게시물 여부를 나타냅니다.',
  })
  @IsBoolean()
  isRepresentative: boolean;
}
