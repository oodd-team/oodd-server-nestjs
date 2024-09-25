import { ApiOperation } from '@nestjs/swagger';

// 유저 조회 API Swagger
export function GetUserSwagger(apiSummary: string) {
  return ApiOperation({ summary: apiSummary });
}

// 회원탈퇴 API Swagger
export function SignOutSwagger(apiSummary: string) {
  return ApiOperation({ summary: apiSummary });
}

// 유저 수정 API Swagger
export function PatchUserSwagger(apiSummary: string) {
  return ApiOperation({ summary: apiSummary });
}

// 이용약관 동의 API Swagger
export function PatchUserTermsSwagger(apiSummary: string) {
  return ApiOperation({ summary: apiSummary });
}
