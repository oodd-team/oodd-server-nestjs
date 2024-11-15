import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { KakaoLoginSwagger, NaverLoginSwagger } from './auth.swagger';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
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
  async kakaoAuth(@Query('redirectUrl') redirectUrl: string) {}

  @ApiExcludeEndpoint()
  @Get('/kakao/callback')
  @UseGuards(KakaoAuthGuard)
  async kakaoAuthCallback(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const { socialUser } = req;
    const url = socialUser.redirectUrl;
    const jwtToken = await this.authService.socialLogin(socialUser, 'kakao');
    return res.redirect(url + '?token=' + jwtToken);
  }

  @Get('/login/naver')
  @NaverLoginSwagger('naver 로그인 API')
  @UseGuards(NaverAuthGuard)
  async naverLogin(@Query('redirectUrl') redirectUrl: string) {}

  @ApiExcludeEndpoint()
  @Get('/naver/callback')
  @UseGuards(NaverAuthGuard)
  async naverLoginCallback(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const { socialUser } = req;
    const url = socialUser.redirectUrl;
    const jwtToken = await this.authService.socialLogin(socialUser, 'naver');
    return res.redirect(url + '?token=' + jwtToken);
  }

  @UseGuards(AuthGuard)
  @Get('/test')
  async test(@Req() req: Request) {
    console.log(req.user);
    return req.user;
  }
}
