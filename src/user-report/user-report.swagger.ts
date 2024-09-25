import { ApiOperation } from '@nestjs/swagger';

// 유저 신고하기 API Swagger
export function PostUserReportSwagger(apiSummary: string) {
  return ApiOperation({ summary: apiSummary });
}
