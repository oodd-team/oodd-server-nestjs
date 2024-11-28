import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { BaseResponse } from 'src/common/response/dto';
import { PostLikeResponseDto } from './dtos/post-like.response';
import { BaseSwaggerDecorator } from 'nestjs-swagger-decorator';
import { GetPostLikesResponseDto } from './dtos/get-post-like.response.dto';

// 게시글 좋아요 리스트 조회 API Swagger
export function GetPostLikesSwagger(apiSummary: string) {
  return BaseSwaggerDecorator(
    { summary: apiSummary },
    [],
    [
      ApiCreatedResponse({
        description: '댓글 리스트 조회 성공',
        type: BaseResponse<GetPostLikesResponseDto>,
      }),
      ApiBadRequestResponse({
        description: '잘못된 요청입니다.',
        type: BaseResponse,
      }),
      ApiUnauthorizedResponse({
        description: '인증되지 않은 사용자입니다.',
        type: BaseResponse,
      }),
      ApiForbiddenResponse({
        description: '권한이 없습니다.',
        type: BaseResponse,
      }),
      ApiInternalServerErrorResponse({
        description: '서버 오류입니다.',
        type: BaseResponse,
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
  );
}

// 게시글 좋아요 생성 및 삭제 API Swagger
export function CreatePostLikeSwagger(apiSummary: string) {
  return (
    ApiOperation({ summary: apiSummary }),
    ApiParam({
      name: 'postId',
      required: true,
      description: '좋아요를 추가하거나 삭제할 게시글 ID',
      example: 78,
    }),
    ApiResponse({
      status: 201,
      description: '좋아요가 성공적으로 생성된 경우',
      type: BaseResponse<PostLikeResponseDto>,
      schema: {
        example: {
          isSuccess: true,
          code: 'SUCCESS',
          data: {
            id: 28,
            userId: 1,
            postId: 78,
            createdAt: '2024-08-13T06:59:09.000Z',
            status: 'activated',
            updatedAt: '2024-08-13T08:16:28.000Z',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: '좋아요가 성공적으로 취소된 경우',
      type: BaseResponse<PostLikeResponseDto>,
      schema: {
        example: {
          isSuccess: true,
          code: 'SUCCESS',
          data: {
            id: 28,
            userId: 1,
            postId: 78,
            createdAt: '2024-08-13T06:59:09.000Z',
            status: 'deactivated',
            updatedAt: '2024-08-13T08:16:28.000Z',
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: '게시글을 찾을 수 없는 경우',
      schema: {
        example: {
          statusCode: 404,
          message: '게시글을 찾을 수 없습니다.',
          error: 'Not Found',
        },
      },
    })
  );
}
