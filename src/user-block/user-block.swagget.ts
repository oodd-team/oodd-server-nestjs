import { ApiOperation } from '@nestjs/swagger';

// 유저 차단하기 API Swagger
export function CreateBlockUserSwagger(apiSummary: string) {
  return ApiOperation({ summary: apiSummary });
}
