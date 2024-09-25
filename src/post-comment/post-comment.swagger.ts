import { ApiOperation } from '@nestjs/swagger';

// 게시글 댓글 생성 API Swagger
export function CreatePostCommentSwagger(apiSummary: string) {
  return ApiOperation({ summary: apiSummary });
}

// 게시글 댓글 조회 API Swagger
export function GetPostCommentsSwagger(apiSummary: string) {
  return ApiOperation({ summary: apiSummary });
}

// 게시글 댓글 삭제 API Swagger
export function DeletePostCommentSwagger(apiSummary: string) {
  return ApiOperation({ summary: apiSummary });
}
