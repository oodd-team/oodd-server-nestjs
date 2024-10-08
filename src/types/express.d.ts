// src/types/express.d.ts
import { Request as Req } from 'express';
import { KakaoUser } from '../auth/dto/auth.dto';

declare module 'express' {
  interface Request extends Req {
    user: {
      kakaoId?: number;
      naverId?: number;
      userId?: number;
    };
    kakaoUser: KakaoUser;
  }
}
