import { Controller, Get, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  GetUserSwagger,
  PatchUserSwagger,
  PatchUserTermsSwagger,
  SignOutSwagger,
} from './user.swagger';

@ApiBearerAuth('Authorization')
@Controller('user')
@ApiTags('[서비스] 유저')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @GetUserSwagger('유저 정보 조회 API')
  getUser() {
    // return this.userService.getHello();
  }

  @Patch()
  @SignOutSwagger('로그아웃 API')
  signOut() {
    // return this.userService.getHello();
  }

  @Patch()
  @PatchUserSwagger('유저 정보 수정 API')
  patchUser() {
    // return this.userService.getHello();
  }

  @Patch()
  @PatchUserTermsSwagger('이용약관 동의 API')
  patchUserTerms() {
    // return this.userService.getHello();
  }
}
