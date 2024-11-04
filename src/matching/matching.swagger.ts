import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
} from '@nestjs/swagger';
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
    [
      ApiBadRequestResponse({ description: 'Bad Request' }),
      ApiNotFoundResponse({ description: '해당 유저가 존재하지 않습니다.' }),
      ApiInternalServerErrorResponse({ description: 'Internal Server Error' }),
    ],
  );
}

// 매칭 생성 상태값 변경 API Swagger
export function PatchMatchingRequestStatusSwagger(apiSummary: string) {
  return BaseSwaggerDecorator(
    { summary: apiSummary },
    [
      {
        statusCode: 200,
        responseOptions: [
          {
            model: BaseResponse,
            exampleTitle: '성공',
            exampleDescription: '성공했을 때 값',
          },
        ],
        baseResponseDto: BaseResponse,
      },
    ],
    [
      ApiBadRequestResponse({ description: 'Bad Request' }),
      ApiNotFoundResponse({ description: '해당 유저가 존재하지 않습니다.' }),
      ApiInternalServerErrorResponse({ description: 'Internal Server Error' }),
    ],
  );
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
