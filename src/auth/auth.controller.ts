import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { KakaoLoginSwagger, NaverLoginSwagger } from './auth.swagger';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { KakaoAuthGuard } from './guards/kakao.auth.guard';
import { BaseResponse } from 'src/common/response/dto';
import { LoginResponse } from './dto/auth.response';
import { NaverAuthGuard } from './guards/naver.auth.guard';
import { AuthGuard } from './guards/jwt.auth.guard';

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
    const { socialUser } = req;
    const jwtToken = await this.authService.socialLogin(socialUser, 'kakao');
    return new BaseResponse<LoginResponse>(true, 'SUCCESS', { jwt: jwtToken });
  }

  @Get('/login/naver')
  @NaverLoginSwagger('naver 로그인 API')
  @UseGuards(NaverAuthGuard)
  async naverLogin() {}

  @ApiExcludeEndpoint()
  @Get('/naver/callback')
  @UseGuards(NaverAuthGuard)
  async naverLoginCallback(
    @Req() req: Request,
  ): Promise<BaseResponse<LoginResponse>> {
    const { socialUser } = req;
    const jwtToken = await this.authService.socialLogin(socialUser, 'naver');
    return new BaseResponse<LoginResponse>(true, 'SUCCESS', { jwt: jwtToken });
  }

  @UseGuards(AuthGuard)
  @Get('/test')
  async test(@Req() req: Request) {
    console.log(req.user);
    return req.user;
  }
}
