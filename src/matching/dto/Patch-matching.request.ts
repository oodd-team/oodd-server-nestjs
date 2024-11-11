import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsIn } from 'class-validator';

export class PatchMatchingRequestDto {
  @ApiProperty({
    example: 'accept',
    enum: ['accept', 'reject'],
    description: '수락 또는 거절',
  })
  @IsString()
  @IsIn(['accept', 'reject'])
  requestStatus: 'accept' | 'reject';
}
