import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { GetUserSwagger } from './userSwagger';

@Controller('user')
@ApiTags('[서비스] 유저')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @GetUserSwagger('유저 정보 조회 API')
  getUser(): string {
    // return this.userService.getHello();
  }
}
