import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtPayload, SocialUser } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userSerivce: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async socialLogin(
    user: SocialUser,
    provider: 'kakao' | 'naver',
  ): Promise<string> {
    let userBySocial;
    if (provider === 'kakao')
      userBySocial = await this.userSerivce.getUserByKaKaoId(user.kakaoId);
    else if (provider === 'naver')
      userBySocial = await this.userSerivce.getUserByNaverId(user.naverId);

    if (!userBySocial)
      return await this.userSerivce.createUserByKakaoOrNaver(user);

    return await this.generateJwtToken({
      id: userBySocial.id,
      email: userBySocial.email,
      nickname: userBySocial.nickname,
      kakaoId: userBySocial.kakaoId ? userBySocial.kakaoId : undefined,
      naverId: userBySocial.naverId ? userBySocial.naverId : undefined,
    });
  }

  async generateJwtToken(user: JwtPayload): Promise<string> {
    return this.jwtService.sign(user);
  }

  async tokenValidateUser(
    payload: JwtPayload,
  ): Promise<JwtPayload | undefined> {
    return await this.userSerivce.findByFields({
      where: { id: payload.id, status: 'activated' },
    });
  }
}
