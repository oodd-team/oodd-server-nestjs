import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-naver';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SocialUser } from '../dto/auth.dto';
import { Request } from 'express';

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get('NAVER_ID'),
      clientSecret: configService.get('NAVER_SECRET'),
      callbackURL: configService.get('NAVER_REDIRECT'),
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
    profile: any,
    done: any,
  ): Promise<any> {
    try {
      const { _json } = profile;
      console.log('profile', profile);
      const naverUser: SocialUser = {
        naverId: _json.id,
        email: _json.email,
        name: _json.name,
        nickname: _json.nickname,
        profilePictureUrl: _json.profile_image,
        redirectUrl: decodeURIComponent(req.query.state as string),
      };

      return naverUser;
      // return done(null, user);
    } catch (error) {
      done(error);
    }
  }
}
