import { ApiOperation } from '@nestjs/swagger';

// 카카오 로그인 API Swagger
export const KakaoLoginSwagger = (text: string) => {
  return ApiOperation({ summary: text });
};

// 카카오 로그인 API Swagger
export const NaverLoginSwagger = (text: string) => {
  return ApiOperation({ summary: text });
};
