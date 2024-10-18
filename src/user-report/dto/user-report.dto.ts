import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

export class CreateUserReportDto {
  @ApiProperty({ example: 1, description: '신고한 사람' })
  @IsNumber()
  @IsNotEmpty()
  fromUserId!: number;

  @ApiProperty({ example: 2, description: '신고당한 사람' })
  @IsNumber()
  @IsNotEmpty()
  toUserId!: number;

  @ApiProperty({ example: '질척거림', description: '신고 사유' })
  @IsString()
  reason!: string;
}