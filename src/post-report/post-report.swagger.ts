import { ApiOperation } from '@nestjs/swagger';

// 게시글 신고하기 API Swagger
export function CreatePostReportSwagger(apiSummary: string) {
  return ApiOperation({ summary: apiSummary });
}
