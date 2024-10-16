import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UploadImageDto, UploadClothingDto } from './create-post.dto';

export class PatchPostDto {
  @ApiProperty({ example: '게시물 내용', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  content?: string;

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

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isRepresentative?: boolean;
}
