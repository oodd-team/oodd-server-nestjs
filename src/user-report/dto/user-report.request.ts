import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

export class UserReportRequest {
  @ApiProperty({ example: 1, description: '신고한 사람' })
  @IsNumber()
  @IsNotEmpty()
  requesterId!: number;

  @ApiProperty({ example: 2, description: '신고당한 사람' })
  @IsNumber()
  @IsNotEmpty()
  targetId!: number;

  @ApiProperty({ example: '질척거림', description: '신고 사유' })
  @IsString()
  reason!: string;
}
