import { ApiProperty } from '@nestjs/swagger';
import dayjs from 'dayjs';
import { User } from 'src/common/entities/user.entity';

export class GetUserInfo {
  @ApiProperty({
    description: 'user ID',
    example: 19,
  })
  id: number;

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

  @ApiProperty({
    type: [String],
    description: '유저 스타일태그',
    example: ['casual', 'street'],
  })
  userStyletags: string[];

  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.phoneNumber = user.phoneNumber;
    this.email = user.email;
    this.nickname = user.nickname;
    this.profilePictureUrl = user.profilePictureUrl;
    this.bio = user.bio;
    this.birthDate = dayjs(user.birthDate).format('YYYY-MM-DDTHH:mm:ssZ');
    this.userStyletags =
      user.userStyletags?.map((userStyleTag) => userStyleTag.styletag.tag) ||
      [];
  }
}

export class GetOtherUserInfo extends GetUserInfo {
  @ApiProperty({
    description: '매칭(친구) 여부',
    example: true,
  })
  isMatching: boolean;

  constructor(user: User, isMatching: boolean) {
    super(user);
    this.isMatching = isMatching;
  }
}
