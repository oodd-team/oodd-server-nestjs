import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { BaseResponse } from 'src/common/response/dto';
import { PostLikeResponseDto } from './dtos/post-like.response';

// 게시글 좋아요 리스트 조회 API Swagger
export function GetPostLikesSwagger(apiSummary: string) {
  return ApiOperation({ summary: apiSummary });
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