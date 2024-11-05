import { IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PatchUserRequest {
  @IsOptional()
  @IsString()
  @MaxLength(10, { message: '닉네임은 최대 10자까지 입력할 수 있습니다.' })
  @ApiProperty({
    description: '수정할 닉네임',
    example: '새닉네임',
    required: false,
  })
  nickname?: string | null;

  @IsOptional()
  @IsUrl({}, { message: '유효한 URL 형식이어야 합니다.' })
  @ApiProperty({
    description: '수정할 프로필 사진 URL',
    example: 'https://example.com/profile.jpg',
    required: false,
  })
  profilePictureUrl?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: '자기소개는 최대 100자까지 입력할 수 있습니다.' })
  @ApiProperty({
    description: '수정할 자기소개',
    example: '소개글~~~^^',
    required: false,
  })
  bio?: string | null;
}
