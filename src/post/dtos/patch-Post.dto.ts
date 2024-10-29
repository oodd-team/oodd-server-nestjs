import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
  MaxLength,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UploadImageDto, UploadClothingDto } from './create-post.dto';

export class PatchImageDto extends UploadImageDto {
  @ApiProperty({
    example: 1,
    description: 'id 값입니다. 기존 이미지 수정시 필요합니다.',
  })
  @IsNumber()
  @IsOptional()
  id?: number;
}

export class PatchClothingDto extends UploadClothingDto {
  @ApiProperty({
    example: 1,
    description: 'id 값입니다. 기존 옷 정보 수정시 필요합니다.',
  })
  @IsNumber()
  @IsOptional()
  id?: number;
}

export class PatchPostDto {
  @ApiProperty({
    example: '게시물 내용',
    required: false,
    description: '게시물의 내용입니다. 최대 100자까지 입력할 수 있습니다.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  content?: string;

  @ApiProperty({
    required: false,
    type: [PatchImageDto],
    description: '게시물에 포함될 이미지 목록입니다.',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PatchImageDto)
  postImages?: PatchImageDto[];

  @ApiProperty({
    required: false,
    type: [String],
    example: [],
    description: '스타일 태그 목록입니다.',
  })
  @IsOptional()
  @IsArray()
  @MaxLength(20, { each: true })
  postStyletags?: string[];

  @ApiProperty({
    required: false,
    type: [PatchClothingDto],
    description: '게시물에 포함될 옷 정보 리스트입니다.',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PatchClothingDto)
  postClothings?: PatchClothingDto[];

  @ApiProperty({
    example: false,
    required: false,
    description: '대표 게시물 여부를 나타냅니다.',
  })
  @IsOptional()
  @IsBoolean()
  isRepresentative?: boolean;
}
