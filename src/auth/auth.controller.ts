import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import {
  GetJwtInfoSwagger,
  KakaoLoginSwagger,
  NaverLoginSwagger,
} from './auth.swagger';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { KakaoAuthGuard } from './guards/kakao.auth.guard';
import { NaverAuthGuard } from './guards/naver.auth.guard';
import { AuthGuard } from './guards/jwt.auth.guard';
import { BaseResponse } from '../common/response/dto';
import { GetUserInfo } from 'src/user/dto/response/user.response';
import dayjs from 'dayjs';

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  @ApiBearerAuth('Authorization')
  @GetJwtInfoSwagger('JWT 토큰 정보 조회 API')
  @Get('/me')
  async test(@Req() req: Request): Promise<BaseResponse<GetUserInfo>> {
    const user = await this.userService.getUserWithTag(req.user?.id);
    const userInfo = new GetUserInfo(user);

    return new BaseResponse<GetUserInfo>(true, 'SUCCESS', userInfo);
  }
}
