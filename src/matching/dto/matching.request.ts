import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Max, Min } from 'class-validator';

export class CreateMatchingReqeust {
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
  @Min(1)
  @Max(100)
  message: string;
}
