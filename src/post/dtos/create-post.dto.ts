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
  @ApiProperty({ example: 'http://example.com/image.jpg' })
  @IsString()
  imageurl: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  orderNum: number;
}

export class UploadClothingDto {
  @ApiProperty({ example: 'http://example.com/clothing.jpg' })
  @IsString()
  imageUrl: string;

  @ApiProperty({ example: '브랜드 이름' })
  @IsString()
  @MaxLength(100)
  brandName: string;

  @ApiProperty({ example: '모델 이름' })
  @IsString()
  @MaxLength(100)
  modelName: string;

  @ApiProperty({ example: '모델 넘버' })
  @IsString()
  @MaxLength(100)
  modelNumber: string;

  @ApiProperty({ example: 'http://example.com/product' })
  @IsString()
  url: string;
}

export class CreatePostDto {
  @ApiProperty({ example: '게시물 내용' })
  @IsString()
  @MaxLength(100)
  content: string;

  @ApiProperty({ required: false, type: [UploadImageDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UploadImageDto)
  postImages?: UploadImageDto[];

  @ApiProperty({ required: false, type: [String], example: 'tag1' })
  @IsOptional()
  @IsArray()
  @MaxLength(20)
  postStyletags?: string[];

  @ApiProperty({ required: false, type: [UploadClothingDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UploadClothingDto)
  postClothings?: UploadClothingDto[];

  @ApiProperty({ example: false })
  @IsBoolean()
  isRepresentative: boolean;
}
