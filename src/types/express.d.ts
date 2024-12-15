// src/types/express.d.ts
import { Request as Req } from 'express';
import { SocialUser } from '../auth/dto/auth.dto';

declare module 'express' {
  interface Request extends Req {
    user: {
      id?: number;
      email?: string;
      nickname?: string;
    };
    socialUser: SocialUser;
  }
}
