import { ApiOperation } from '@nestjs/swagger';
import { BaseSwaggerDecorator } from 'nestjs-swagger-decorator';
import { BaseResponse } from 'src/common/response/dto';
import { CreatePostDto } from './dtos/create-post.dto';
import { PatchPostDto } from './dtos/patch-Post.dto';

// 게시글 리스트 조회하기 API Swagger
export function GetPostsSwagger(apiSummary: string) {
  return ApiOperation({ summary: apiSummary });
}

// 게시글 상세 조회하기 API Swagger
export function GetPostSwagger(apiSummary: string) {
  return ApiOperation({ summary: apiSummary });
}

// 게시글 생성하기 API Swagger
export function CreatePostsSwagger(text: string) {
  return BaseSwaggerDecorator(
    { summary: text },
    [
      {
        statusCode: 200,
        responseOptions: [
          {
            model: CreatePostDto,
            exampleTitle: '성공',
            exampleDescription: '성공했을 때 값',
          },
        ],
        baseResponseDto: BaseResponse,
      },
      {
        statusCode: 400,
        responseOptions: [
          {
            model: BaseResponse,
            exampleTitle: '실패',
            exampleDescription: '잘못된 요청입니다.',
            overwriteValue: {
              isSuccess: false,
              code: 'BAD_REQUEST',
              data: null,
            },
          },
        ],
      },
      {
        statusCode: 401,
        responseOptions: [
          {
            model: BaseResponse,
            exampleTitle: '실패',
            exampleDescription: '사용자 인증 실패',
            overwriteValue: {
              isSuccess: false,
              code: 'UNAUTHORIZED',
              data: null,
            },
          },
        ],
      },
      {
        statusCode: 500,
        responseOptions: [
          {
            model: BaseResponse,
            exampleTitle: '실패',
            exampleDescription: '서버에서 오류 발생',
            overwriteValue: {
              isSuccess: false,
              code: 'INTERNAL_SERVER_ERROR',
              data: null,
            },
          },
        ],
      },
    ],
    [],
  );
}

// 게시글 수정 API Swagger
export function PatchPostSwagger(text: string) {
  return BaseSwaggerDecorator(
    { summary: text },
    [
      {
        statusCode: 200,
        responseOptions: [
          {
            model: PatchPostDto,
            exampleTitle: '성공',
            exampleDescription: '성공했을 때 값',
          },
        ],
        baseResponseDto: BaseResponse,
      },
      {
        statusCode: 400,
        responseOptions: [
          {
            model: BaseResponse,
            exampleTitle: '실패',
            exampleDescription: '잘못된 요청입니다.',
            overwriteValue: {
              isSuccess: false,
              code: 'BAD_REQUEST',
              data: null,
            },
          },
        ],
      },
      {
        statusCode: 401,
        responseOptions: [
          {
            model: BaseResponse,
            exampleTitle: '실패',
            exampleDescription: '사용자 인증 실패',
            overwriteValue: {
              isSuccess: false,
              code: 'UNAUTHORIZED',
              data: null,
            },
          },
        ],
      },
      {
        statusCode: 500,
        responseOptions: [
          {
            model: BaseResponse,
            exampleTitle: '실패',
            exampleDescription: '서버에서 오류 발생',
            overwriteValue: {
              isSuccess: false,
              code: 'INTERNAL_SERVER_ERROR',
              data: null,
            },
          },
        ],
      },
    ],
    [],
  );
}

// 대표 게시글 지정 API Swagger
export function PatchIsRepresentativeSwagger(apiSummary: string) {
  return ApiOperation({ summary: apiSummary });
}
