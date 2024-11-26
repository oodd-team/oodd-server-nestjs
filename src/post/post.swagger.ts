import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { BaseSwaggerDecorator } from 'nestjs-swagger-decorator';
import { BaseResponse } from 'src/common/response/dto';
import { GetAllPostsResponse } from './dtos/all-posts.response';
import {
  GetMyPostsResponse,
  GetOtherPostsResponse,
} from './dtos/user-posts.response';
import { applyDecorators } from '@nestjs/common';
import { PostDetailResponse } from './dtos/post.response';
import { PostResponse } from './dtos/post.response';

// 게시글 리스트 조회하기 API Swagger
export function GetPostsSwagger(text: string) {
  return applyDecorators(
    BaseSwaggerDecorator(
      { summary: text },
      [
        {
          statusCode: 200,
          responseOptions: [
            {
              model: GetAllPostsResponse,
              exampleTitle: '전체 게시글 조회 예시',
              exampleDescription: '전체 게시글 조회 성공 시 값',
            },
            {
              model: GetMyPostsResponse,
              exampleTitle: '내 게시글 조회 예시',
              exampleDescription: '내 게시글 조회 성공 시 값',
            },
            {
              model: GetOtherPostsResponse,
              exampleTitle: '다른 사용자 게시글 조회 예시',
              exampleDescription: '다른 사용자 게시글 조회 성공 시 값',
            },
          ],
          baseResponseDto: BaseResponse,
        },
      ],
      [
        ApiBadRequestResponse({ description: 'Bad Request' }),
        ApiNotFoundResponse({
          description: '해당 게시글이 존재하지 않습니다.',
        }),
        ApiInternalServerErrorResponse({
          description: 'Internal Server Error',
        }),
        ApiQuery({
          name: 'userId',
          required: false,
          description:
            'User ID가 제공되면 사용자 게시글 조회, 제공되지 않으면 전체 게시글이 조회됩니다. User ID가 현재 사용자면 내 게시물 조회, 다른 사용자면 다른 사용자 게시물 조회입니다.',
          type: Number,
        }),
        ApiQuery({
          name: 'page',
          required: false,
          description: '페이지 번호',
          type: Number,
        }),
        ApiQuery({
          name: 'take',
          required: false,
          description: '한 페이지에 불러올 데이터 개수',
        }),
      ],
    ),
  );
}

// 게시글 상세 조회하기 API Swagger
export function GetPostSwagger(text: string) {
  return BaseSwaggerDecorator(
    { summary: text },
    [
      {
        statusCode: 200,
        responseOptions: [
          {
            model: PostDetailResponse,
            exampleTitle: '성공',
            exampleDescription: '성공했을 때 값',
          },
        ],
        baseResponseDto: BaseResponse,
      },
    ],
    [
      ApiBadRequestResponse({ description: 'Bad Request' }),
      ApiNotFoundResponse({ description: '해당 게시글이 존재하지 않습니다.' }),
      ApiInternalServerErrorResponse({ description: 'Internal Server Error' }),
    ],
  );
}

// 게시글 생성하기 API Swagger
export function CreatePostsSwagger(text: string) {
  return BaseSwaggerDecorator(
    { summary: text },
    [
      {
        statusCode: 201,
        responseOptions: [
          {
            model: PostResponse,
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

// 게시글 수정 API Swagger
export function PatchPostSwagger(text: string) {
  return BaseSwaggerDecorator(
    { summary: text },
    [
      {
        statusCode: 200,
        responseOptions: [
          {
            model: PostResponse,
            exampleTitle: '성공',
            exampleDescription: '성공했을 때 값',
          },
        ],
        baseResponseDto: BaseResponse,
      },
    ],
    [
      ApiBadRequestResponse({ description: 'Bad Request' }),
      ApiNotFoundResponse({ description: '해당 게시글이 존재하지 않습니다.' }),
      ApiInternalServerErrorResponse({ description: 'Internal Server Error' }),
    ],
  );
}

// 게시글 삭제 API Swagger
export function DeletePostSwagger(text: string) {
  return BaseSwaggerDecorator(
    { summary: text },
    [],
    [
      ApiOkResponse({ description: '성공', type: BaseResponse }),
      ApiBadRequestResponse({ description: 'Bad Request' }),
      ApiNotFoundResponse({ description: '해당 게시글이 존재하지 않습니다.' }),
      ApiInternalServerErrorResponse({ description: 'Internal Server Error' }),
    ],
  );
}

// 대표 게시글 지정 API Swagger
export function PatchIsRepresentativeSwagger(text: string) {
  return BaseSwaggerDecorator(
    { summary: text },
    [],
    [
      ApiOkResponse({ description: '성공', type: BaseResponse }),
      ApiBadRequestResponse({ description: 'Bad Request' }),
      ApiNotFoundResponse({ description: '해당 게시글이 존재하지 않습니다.' }),
      ApiInternalServerErrorResponse({ description: 'Internal Server Error' }),
    ],
  );
}
