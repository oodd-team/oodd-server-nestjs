import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateMatchingRequest {
  @ApiProperty({ example: 1, description: '신청하는 유저 아이디' })
  @IsInt()
  requesterId: number;

  @ApiProperty({ example: 2, description: '매칭 상대 유저 아이디' })
  @IsInt()
  targetId: number;

  @ApiProperty({
    description: '매칭 요청 메시지',
    example: '안녕하세요! 매칭 요청합니다.',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  message: string;
}

export class PatchMatchingRequest {
  @ApiProperty({ example: 1, description: '매칭 아이디' })
  @IsInt()
  id: number;

  @ApiProperty({
    example: 'accept',
    enum: ['accept', 'reject'],
    description: '수락 또는 거절',
  })
  @IsString()
  @IsIn(['accept', 'reject'])
  requestStatus: 'accept' | 'reject';
}
