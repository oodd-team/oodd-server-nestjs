import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-naver';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SocialUser } from '../dto/auth.dto';

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get('NAVER_ID'),
      clientSecret: configService.get('NAVER_SECRET'),
      callbackURL: configService.get('NAVER_REDIRECT'),
    });
  }

  async validate(
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
      };

      return naverUser;
      // return done(null, user);
    } catch (error) {
      done(error);
    }
  }
}
