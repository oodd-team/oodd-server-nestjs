import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { BaseSwaggerDecorator } from 'nestjs-swagger-decorator';
import { BaseResponse } from 'src/common/response/dto';
import { GetPostsResponse } from './dtos/total-postsResponse.dto';
import {
  GetMyPostsResponse,
  GetOtherPostsResponse,
} from './dtos/user-postsResponse.dto';

// 게시글 리스트 조회하기 API Swagger
export function GetPostsSwagger(text: string) {
  return BaseSwaggerDecorator(
    { summary: text },
    [
      {
        statusCode: 200,
        responseOptions: [
          {
            model: GetPostsResponse,
            exampleTitle: '성공',
            exampleDescription: '전체 게시글 조회 성공 시 값',
          },
        ],
        baseResponseDto: BaseResponse,
      },
      {
        statusCode: 200,
        responseOptions: [
          {
            model: GetMyPostsResponse,
            exampleTitle: '성공',
            exampleDescription: '내 게시글 조회 성공 시 값',
          },
        ],
        baseResponseDto: BaseResponse,
      },
      {
        statusCode: 200,
        responseOptions: [
          {
            model: GetOtherPostsResponse,
            exampleTitle: '성공',
            exampleDescription: '다른 사용자 게시글 조회 성공 시 값',
          },
        ],
        baseResponseDto: BaseResponse,
      },
    ],
    [
      ApiBadRequestResponse({
        description: '잘못된 요청입니다.',
        type: BaseResponse,
      }),
      ApiUnauthorizedResponse({
        description: '인증에 실패했습니다.',
        type: BaseResponse,
      }),
      ApiNotFoundResponse({
        description: '존재하지 않는 게시글입니다.',
        type: BaseResponse,
      }),
      ApiInternalServerErrorResponse({
        description: '서버 에러입니다.',
        type: BaseResponse,
      }),
    ],
  );
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
