import { ApiOperation } from '@nestjs/swagger';

// 게시글 리스트 조회하기 API Swagger
export function GetPostsSwagger(apiSummary: string) {
  return ApiOperation({ summary: apiSummary });
}

// 게시글 상세 조회하기 API Swagger
export function GetPostSwagger(apiSummary: string) {
  return ApiOperation({ summary: apiSummary });
}

// 게시글 생성하기 API Swagger
export function CreatePostsSwagger(apiSummary: string) {
  return ApiOperation({ summary: apiSummary });
}

// 게시글 수정 API Swagger
export function PatchPostSwagger(apiSummary: string) {
  return ApiOperation({ summary: apiSummary });
}

// 대표 게시글 지정 API Swagger
export function PatchIsRepresentativeSwagger(apiSummary: string) {
  return ApiOperation({ summary: apiSummary });
}
