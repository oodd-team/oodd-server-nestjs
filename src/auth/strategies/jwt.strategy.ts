import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { JwtPayload } from '../dto/auth.dto';
import { UnauthorizedException } from 'src/common/exception/service.exception';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  // controller에 요청이 왔을 때 constructor가 실행
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      // accessToken 위치
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.authService.tokenValidateUser(payload);
    if (!user) {
      throw UnauthorizedException('유효하지 않은 토큰입니다.');
    }
    return { id: payload.id, email: payload.email, nickname: payload.nickname };
  }
}
