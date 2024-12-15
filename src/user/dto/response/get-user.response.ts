import { ApiProperty } from '@nestjs/swagger';

export class GetUserInfo {
  @ApiProperty({
    description: 'user ID',
    example: 19,
  })
  userId: number;

  @ApiProperty({
    description: '이름',
    example: '임민서',
  })
  name: string;

  @ApiProperty({
    description: '전화번호',
    example: '010-1234-5678',
  })
  phoneNumber: string;

  @ApiProperty({
    description: '이메일',
    example: ' limms1217@naver.com',
  })
  email: string;

  @ApiProperty({
    description: '닉네임',
    example: '민서',
  })
  nickname: string;

  @ApiProperty({
    description: '프로필 사진 URL',
    example: 'https://example.com/profile.jpg',
  })
  profilePictureUrl: string;

  @ApiProperty({
    description: '자기소개',
    example: '안녕하세요',
  })
  bio: string;

  @ApiProperty({
    description: '생일',
    example: '2000-12-17',
  })
  birthDate: string;
}

export class GetOtherUserInfo extends GetUserInfo {
  @ApiProperty({
    description: '친구 여부',
    example: true,
  })
  isFriend: boolean;
}
