import { ApiOperation } from '@nestjs/swagger';

// 게시글 좋아요 리스트 조회 API Swagger
export function GetPostLikesSwagger(apiSummary: string) {
  return ApiOperation({ summary: apiSummary });
}

// 게시글 좋아요 생성 API Swagger
export function CreatePostLikeSwagger(apiSummary: string) {
  return ApiOperation({ summary: apiSummary });
}
