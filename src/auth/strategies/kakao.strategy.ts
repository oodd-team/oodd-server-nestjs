import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-kakao';
import { KakaoUser } from '../dto/auth.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtKakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get('KAKAO_ID'), //.env파일에 들어있음\
      clientSecret: configService.get('KAKAO_SECRET'), //.env파일에 들어있음
      callbackURL: configService.get('KAKAO_REDIRECT'), //.env파일에 들어있음
      // scope: ["account_email", "profile_nickname"],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: any, user?: KakaoUser, info?: any) => void,
  ) {
    try {
      const { _json } = profile;
      const kakaoUser = {
        kakaoId: _json.id,
        email: _json.kakao_account.email,
        nickname: _json.properties.nickname,
        photo: _json.properties.profile_image,
      };
      // done(null, user);
      return kakaoUser;
    } catch (error) {
      done(error);
    }
  }
}
