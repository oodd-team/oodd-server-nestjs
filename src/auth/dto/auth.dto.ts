export interface KakaoUser {
  kakaoId: string;
  email: string;
  nickname: string;
  photo: string;
}

export interface JwtPayload {
  id: number;
  email: string;
  nickname: string;
  kakaoId?: string;
  naverId?: string;
}
