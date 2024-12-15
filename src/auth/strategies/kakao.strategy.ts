import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-kakao';
import { SocialUser } from '../dto/auth.dto';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtKakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(private configService: ConfigService) {
    super({
      clientID: process.env.KAKAO_ID, //.env파일에 들어있음\
      clientSecret: process.env.KAKAO_SECRET, //.env파일에 들어있음
      callbackURL: process.env.KAKAO_REDIRECT, //.env파일에 들어있음
      passReqToCallback: true,
    });
  }

  async authenticate(req: Request) {
    if (req.query.redirectUrl) {
      // /auth
      return super.authenticate(req, {
        state: encodeURIComponent(req.query.redirectUrl as string),
      });
    }
    // /auth/callback
    return super.authenticate(req);
  }

  async validate(
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: any, user?: SocialUser, info?: any) => void,
  ) {
    try {
      const { _json } = profile;
      const kakaoUser: SocialUser = {
        kakaoId: _json.id,
        email: _json.kakao_account.email,
        nickname: _json.properties.nickname,
        profilePictureUrl: _json.properties.profile_image,
        redirectUrl: decodeURIComponent(req.query.state as string),
      };
      // done(null, user);
      return kakaoUser;
    } catch (error) {
      done(error);
    }
  }
}
