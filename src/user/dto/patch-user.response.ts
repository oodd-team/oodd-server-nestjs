import { ApiProperty } from '@nestjs/swagger';

export class PatchUserResponse {
  @ApiProperty({
    description: 'user ID',
    example: '19',
  })
  userId: number;

  @ApiProperty({
    description: '수정된 닉네임',
    example: '새 닉네임',
  })
  nickname: string;

  @ApiProperty({
    description: '수정된 프로필 사진 URL',
    example: 'https://example.com/profile.jpg',
  })
  profilePictureUrl: string;

  @ApiProperty({
    description: '수정된 자기소개',
    example: '소개글~~~^^',
  })
  bio: string;
}
