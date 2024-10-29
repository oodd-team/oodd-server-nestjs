import { Body, Controller, Post } from '@nestjs/common';
import { UserBlockService } from './user-block.service';
import { CreateBlockUserSwagger } from './user-block.swagget';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserBlockDto } from './dtos/user-block.dto';
import { BaseResponse } from 'src/common/response/dto';

@Controller('user-block')
@ApiTags('[서비스] 유저 차단')
export class UserBlockController {
  constructor(private readonly userBlockService: UserBlockService) {}

  @Post()
  @CreateBlockUserSwagger('유저 차단하기 API')
  async createUserBlock(@Body() createUserBlockDto: CreateUserBlockDto,
): Promise<BaseResponse<null>> {
  const fromUserId = 1; // 추후 수정
  createUserBlockDto.fromUserId = fromUserId;

  await this.userBlockService.createBlock(createUserBlockDto);

  const resultCode = await this.userBlockService.createBlock(createUserBlockDto);

  if (resultCode === 'BLOCKED_SUCCESS') {
    return new BaseResponse<null>(true, 'BLOCKED_SUCCESS', null);
  } else if (resultCode === 'UNBLOCKED_SUCCESS') {
    return new BaseResponse<null>(true, 'UNBLOCKED_SUCCESS', null);
  }
  
}
}