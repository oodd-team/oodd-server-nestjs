import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { BaseSwaggerDecorator } from 'nestjs-swagger-decorator';
import { BaseResponse } from 'src/common/response/dto';
import { GetUserInfo } from './dto/response/user.response';

// 유저 조회 API Swagger
export function GetUserSwagger(apiSummary: string) {
  return BaseSwaggerDecorator(
    { summary: apiSummary },
    [
      {
        statusCode: 200,
        responseOptions: [
          {
            model: GetUserInfo,
            exampleTitle: '성공',
            exampleDescription: '유저 조회 성공',
          },
        ],
        baseResponseDto: BaseResponse,
      },
    ],
    [
      ApiBadRequestResponse({ description: 'Bad Request' }),
      ApiNotFoundResponse({ description: '해당 유저가 존재하지 않습니다.' }),
      ApiInternalServerErrorResponse({
        description: 'Internal Server Error',
      }),
    ],
  );
}

// 회원탈퇴 API Swagger
export function WithdrawSwagger(apiSummary: string) {
  return BaseSwaggerDecorator(
    { summary: apiSummary },
    [
      {
        statusCode: 200,
        responseOptions: [
          {
            model: BaseResponse,
            exampleTitle: '성공',
            exampleDescription: '회원탈퇴 성공',
          },
        ],
        baseResponseDto: BaseResponse,
      },
    ],
    [
      ApiBadRequestResponse({ description: 'Bad Request' }),
      ApiNotFoundResponse({ description: '해당 유저가 존재하지 않습니다.' }),
      ApiInternalServerErrorResponse({
        description: 'Internal Server Error',
      }),
    ],
  );
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
            model: GetUserInfo,
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
    [],
    [
      ApiCreatedResponse({ description: '이용약관 동의 성공' }),
      ApiBadRequestResponse({ description: 'Bad Request' }),
      ApiNotFoundResponse({ description: '해당 유저가 존재하지 않습니다.' }),
      ApiInternalServerErrorResponse({ description: 'Internal Server Error' }),
    ],
  );
}
