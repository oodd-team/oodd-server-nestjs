import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { BaseSwaggerDecorator } from 'nestjs-swagger-decorator';
import { BaseResponse } from 'src/common/response/dto';
import { PatchPostResponse } from './dtos/patch-post.response';
import { GetAllPostsResponse } from './dtos/all-posts.response';
import {
  GetMyPostsResponse,
  GetOtherPostsResponse,
} from './dtos/user-posts.response';
import { applyDecorators } from '@nestjs/common';
import { GetPostResponse } from './dtos/get-post.dto';
import { PageDto } from './dtos/page.dto';
import { CreatePostResponse } from './dtos/create-post.response';

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
              model: PageDto<GetAllPostsResponse>,
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
            model: GetPostResponse,
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
            model: CreatePostResponse,
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
            model: PatchPostResponse,
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
