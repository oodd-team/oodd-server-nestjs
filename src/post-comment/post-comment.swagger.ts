import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { BaseSwaggerDecorator } from 'nestjs-swagger-decorator';
import { BaseResponse } from 'src/common/response/dto';
import { CreateCommentDto } from './dtos/create-comment.dto';

// 게시글 댓글 생성 API Swagger
export function CreatePostCommentSwagger(text: string) {
  return BaseSwaggerDecorator(
    { summary: text },
    [],
    [
      ApiCreatedResponse({
        description: '댓글 작성 성공',
        type: CreateCommentDto,
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
    ],
  );
}

// 게시글 댓글 조회 API Swagger
export function GetPostCommentsSwagger(apiSummary: string) {
  return ApiOperation({ summary: apiSummary });
}

// 게시글 댓글 삭제 API Swagger
export function DeletePostCommentSwagger(text: string) {
  return BaseSwaggerDecorator(
    { summary: text },
    [],
    [
      ApiAcceptedResponse({
        description: '댓글 삭제 성공',
        type: BaseResponse,
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
      ApiNotFoundResponse({
        description: '게시글을 찾을 수 없습니다.',
        type: BaseResponse,
      }),
      ApiInternalServerErrorResponse({
        description: '서버 오류입니다.',
        type: BaseResponse,
      }),
    ],
  );
}
