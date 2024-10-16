import { ApiOperation } from '@nestjs/swagger';
import { BaseSwaggerDecorator } from 'nestjs-swagger-decorator';
import { BaseResponse } from 'src/common/response/dto';
import { CreateCommentDto } from './dtos/create-comment.dto';

// 게시글 댓글 생성 API Swagger
export function CreatePostCommentSwagger(text: string) {
  return BaseSwaggerDecorator(
    { summary: text },
    [
      {
        statusCode: 200,
        responseOptions: [
          {
            model: CreateCommentDto,
            exampleTitle: '댓글 작성 성공',
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
        statusCode: 404,
        responseOptions: [
          {
            model: BaseResponse,
            exampleTitle: '실패',
            exampleDescription: '게시글을 찾을 수 없습니다.',
            overwriteValue: {
              isSuccess: false,
              code: 'NOT_FOUND',
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

// 게시글 댓글 조회 API Swagger
export function GetPostCommentsSwagger(apiSummary: string) {
  return ApiOperation({ summary: apiSummary });
}

// 게시글 댓글 삭제 API Swagger
export function DeletePostCommentSwagger(apiSummary: string) {
  return ApiOperation({ summary: apiSummary });
}
