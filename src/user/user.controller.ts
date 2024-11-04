import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  GetUserSwagger,
  PatchUserSwagger,
  PatchUserTermsSwagger,
  SignOutSwagger,
} from './user.swagger';
import { AuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { PatchUserRequest } from './dto/patch-user.request';
import { BaseResponse } from 'src/common/response/dto';
import { Request } from 'express';
import {
  DataNotFoundException,
  UnauthorizedException,
} from 'src/common/exception/service.exception';

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

  @Patch(':userId')
  @UseGuards(AuthGuard)
  @PatchUserSwagger('유저 정보 수정 API')
  async patchUser(
    @Req() req: Request,
    @Param('userId') userId: number,
    @Body() body: PatchUserRequest,
  ): Promise<BaseResponse<any>> {
    if (!(await this.userService.getUserById(userId)))
      throw DataNotFoundException('유저가 존재하지 않습니다.');
    if (req.user.id !== Number(userId)) {
      throw UnauthorizedException('권한이 없습니다.');
    }

    const updatedUser = await this.userService.PatchUser(userId, body);

    return new BaseResponse(true, '유저 정보 수정 성공', updatedUser);
  }

  @Patch()
  @PatchUserTermsSwagger('이용약관 동의 API')
  patchUserTerms() {
    // return this.userService.getHello();
  }
}
