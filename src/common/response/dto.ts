import { ApiProperty } from '@nestjs/swagger';

export class BaseResponse<T> {
  constructor(isSuccess, code, data?: T) {
    this.isSuccess = isSuccess;
    this.code = code;
    this.data = data;
  }

  @ApiProperty({ example: true })
  isSuccess: boolean = true;

  @ApiProperty({ example: 'SUCCESS' })
  code: string = 'SUCCESS';

  @ApiProperty({ required: false })
  data?: T;
}
