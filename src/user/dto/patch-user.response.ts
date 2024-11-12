import { ApiProperty } from '@nestjs/swagger';

export class PatchUserResponse {
  @ApiProperty({
    description: 'user ID',
    example: '19',
  })
  userId: number;

  @ApiProperty({
    description: '수정 후 이름',
    example: '새 이름',
  })
  name: string;

  @ApiProperty({
    description: '수정 후 전화번호',
    example: '010-9876-5432',
  })
  phoneNumber: string;

  @ApiProperty({
    description: '수정 후 이메일',
    example: 'xxndksd@naver.com',
  })
  email: string;

  @ApiProperty({
    description: '수정 후 닉네임',
    example: '새 닉네임',
  })
  nickname: string;

  @ApiProperty({
    description: '수정 후 프로필 사진 URL',
    example: 'https://example.com/profile.jpg',
  })
  profilePictureUrl: string;

  @ApiProperty({
    description: '수정 후 자기소개',
    example: '소개글~~~^^',
  })
  bio: string;
}
