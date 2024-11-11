import { ApiProperty } from '@nestjs/swagger';

export class PatchMatchingResponseDto {
  @ApiProperty({ example: 1, description: '매칭 ID' })
  matchingId: number;

  @ApiProperty({ example: 1, description: '신청한 유저 아이디' })
  requesterId: number;

  @ApiProperty({ example: 2, description: '매칭 상대 유저 아이디' })
  targetId: number;

  @ApiProperty({
    example: 'accept',
    enum: ['accept', 'reject', 'pending'],
    description: '수락 또는 거절',
  })
  requestStatus: 'accept' | 'reject' | 'pending';
}
