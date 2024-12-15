export interface SocialUser {
  kakaoId?: string;
  naverId?: string;
  email?: string;
  name?: string;
  nickname?: string;
  profilePictureUrl?: string;
  redirectUrl?: string;
}

export interface JwtPayload {
  id: number;
  email: string;
  nickname: string;
  kakaoId?: string;
  naverId?: string;
}
