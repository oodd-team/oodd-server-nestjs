import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { KakaoLoginSwagger, NaverLoginSwagger } from './auth.swagger';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { KakaoAuthGuard } from './guards/kakao.auth.guard';
import { BaseResponse } from 'src/common/response/dto';
import { LoginResponse } from './dto/auth.response';

@Controller('auth')
@ApiTags('[서비스] Auth 관련')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Get('/login/kakao')
  @KakaoLoginSwagger('kakao 로그인 API')
  @UseGuards(KakaoAuthGuard)
  async kakaoAuth() {}

  @ApiExcludeEndpoint()
  @Get('/kakao/callback')
  @UseGuards(KakaoAuthGuard)
  async kakaoAuthCallback(
    @Req() req: Request,
  ): Promise<BaseResponse<LoginResponse>> {
    const { kakaoUser } = req;
    console.log(kakaoUser);
    const jwtToken = await this.authService.kakaoLogin(kakaoUser);
    return new BaseResponse<LoginResponse>(true, 'SUCCESS', { jwt: jwtToken });
  }

  @Post()
  @NaverLoginSwagger('naver 로그인 API')
  naverLogin() {
    // return this.userService.getHello();
  }
}
