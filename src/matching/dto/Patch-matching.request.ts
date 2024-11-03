import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsIn } from 'class-validator';

export class PatchMatchingRequestDto {
  @ApiProperty({ example: 1, description: '매칭 ID' })
  @IsInt()
  matchingId: number;

  @ApiProperty({ example: 1, description: '신청하는 유저 아이디' })
  @IsInt()
  requesterId: number;

  @ApiProperty({ example: 2, description: '매칭 상대 유저 아이디' })
  @IsInt()
  targetId: number;

  @ApiProperty({
    example: 'accept',
    enum: ['accept', 'reject'],
    description: '수락 또는 거절',
  })
  @IsString()
  @IsIn(['accept', 'reject'])
  action: 'accept' | 'reject';
}
