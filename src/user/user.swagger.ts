import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { BaseSwaggerDecorator } from 'nestjs-swagger-decorator';
import { BaseResponse } from 'src/common/response/dto';

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

// 이용약관 동의 API Swagger
export function PatchUserTermsSwagger(apiSummary: string) {
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
