import { Controller, Post } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { KakaoLoginSwagger, NaverLoginSwagger } from './auth.swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @KakaoLoginSwagger('kakao 로그인 API')
  kakaoLogin() {
    // return this.userService.getHello();
  }

  @Post()
  @NaverLoginSwagger('naver 로그인 API')
  naverLogin() {
    // return this.userService.getHello();
  }
}
