import { Controller, Post } from '@nestjs/common';
import { UserBlockService } from './user-block.service';
import { CreateBlockUserSwagger } from './user-block.swagget';

@Controller('user-block')
export class UserBlockController {
  constructor(private readonly userBlockService: UserBlockService) {}

  @Post()
  @CreateBlockUserSwagger('유저 차단하기 API')
  createUserBlock() {
    // return this.userService.getHello();
  }
}