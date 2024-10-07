import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtPayload, KakaoUser } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userSerivce: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async kakaoLogin(user: KakaoUser): Promise<string> {
    const userByKakao = await this.userSerivce.getUserByKaKaoId(user.kakaoId);

    if (!userByKakao) return await this.userSerivce.createUserByKakao(user);

    return await this.generateJwtToken(userByKakao);
  }

  async generateJwtToken(user: JwtPayload): Promise<string> {
    return this.jwtService.sign(user);
  }

  async tokenValidateUser(
    payload: JwtPayload,
  ): Promise<JwtPayload | undefined> {
    return await this.userSerivce.findByFields({
      where: { id: payload.id },
    });
  }
}
