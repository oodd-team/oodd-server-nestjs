import {
  IsArray,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PatchUserRequest {
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: '이름은 최대 100자까지 입력할 수 있습니다.' })
  @IsNotEmpty({ message: '이름을 비울 수 없습니다.' })
  @ApiProperty({
    description: '수정할 이름',
    example: '새 이름',
    required: false,
  })
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(15, { message: '전화번호는 최대 15자까지 입력할 수 있습니다.' })
  @IsNotEmpty({ message: '전화번호를 비울 수 없습니다.' })
  @ApiProperty({
    description: '수정할 전화번호',
    example: '010-9876-5432',
    required: false,
  })
  phoneNumber?: string;

  @IsOptional()
  @IsDateString({}, { message: '유효한 날짜 형식이어야 합니다.' })
  @ApiProperty({
    description: '수정할 생년월일',
    example: '2002-02-08',
    required: false,
  })
  birthDate?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(100, { message: '이메일은 최대 100자까지 입력할 수 있습니다.' })
  @IsNotEmpty({ message: '이메일을 비울 수 없습니다.' })
  @ApiProperty({
    description: '수정할 이메일',
    example: 'xxndksd@naver.com',
    required: false,
  })
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10, { message: '닉네임은 최대 10자까지 입력할 수 있습니다.' })
  @IsNotEmpty({ message: '닉네임을 비울 수 없습니다.' })
  @ApiProperty({
    description: '수정할 닉네임',
    example: '새 닉네임',
    required: false,
  })
  nickname?: string;

  @IsOptional()
  @IsUrl({}, { message: '유효한 URL 형식이어야 합니다.' })
  @ApiProperty({
    description: '수정할 프로필 사진 URL',
    example: 'https://example.com/profile.jpg',
    required: false,
  })
  profilePictureUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: '자기소개는 최대 100자까지 입력할 수 있습니다.' })
  @ApiProperty({
    description: '수정할 자기소개',
    example: '소개글~~~^^',
    required: false,
  })
  bio?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(20, {
    each: true,
    message: '각 스타일 태그는 최대 20자까지 입력할 수 있습니다.',
  })
  @ApiProperty({
    description: '수정할 유저 스타일 태그 배열',
    example: ['casual', 'street'],
    required: false,
    type: [String],
  })
  userStyletags?: string[];
}
