import { ApiOperation } from '@nestjs/swagger';
import { BaseSwaggerDecorator } from 'nestjs-swagger-decorator';
import { PostMatchingResponse } from './dto/matching.response';
import { BaseResponse } from 'src/common/response/dto';

// 매칭 생성 API Swagger
export function CreateMatchingSwagger(apiSummary: string) {
  return BaseSwaggerDecorator(
    { summary: apiSummary },
    [
      {
        statusCode: 200,
        responseOptions: [
          {
            model: PostMatchingResponse,
            exampleTitle: '성공',
            exampleDescription: '성공했을 때 값',
          },
        ],
        baseResponseDto: BaseResponse,
      },
    ],
    [],
  );
}

// 매칭 생성 상태값 변경 API Swagger
export function PatchMatchingRequestStatusSwagger(apiSummary: string) {
  return ApiOperation({ summary: apiSummary });
}

// 매칭 리스트 조회 API Swagger
export function GetMatchingsSwagger(apiSummary: string) {
  return ApiOperation({ summary: apiSummary });
}

// 매칭 조회 API Swagger
export function GetMatchingSwagger(apiSummary: string) {
  return ApiOperation({ summary: apiSummary });
}

// 매칭 삭제 API Swagger
export function DeleteMatchingSwagger(apiSummary: string) {
  return ApiOperation({ summary: apiSummary });
}
