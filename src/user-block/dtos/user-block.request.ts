import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UserBlockRequest {
  @ApiProperty({ example: 1, description: '차단한 사람' })
  @IsNumber()
  @IsNotEmpty()
  requesterId!: number;

  @ApiProperty({ example: 2, description: '차단 당한 사람' })
  @IsNumber()
  @IsNotEmpty()
  targetId!: number;

  @ApiProperty({
    example: 'block',
    description: '차단하고 싶으면 block, 안 하고 싶으면 unblock',
  })
  @IsString()
  @IsNotEmpty()
  action!: 'block' | 'unblock';
}
