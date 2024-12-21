import { BaseSwaggerDecorator } from 'nestjs-swagger-decorator';
import { LoginResponse } from './dto/auth.response';
import { BaseResponse } from 'src/common/response/dto';
import { ErrorCodeVo } from 'src/common/exception/error';
import { ApiInternalServerErrorResponse } from '@nestjs/swagger';
import { GetUserInfo } from 'src/user/dto/response/get-user.response';

// 카카오 로그인 API Swagger
export const KakaoLoginSwagger = (text: string) => {
  return BaseSwaggerDecorator(
    { summary: text },
    [
      {
        statusCode: 200,
        responseOptions: [
          {
            model: LoginResponse,
            exampleTitle: '성공',
            exampleDescription: '성공했을 때 값',
          },
        ],
        baseResponseDto: BaseResponse,
      },
    ],
    [
      ApiInternalServerErrorResponse({
        type: ErrorCodeVo,
        description: '서버에서 발생한 오류',
      }),
    ],
  );
};

// 카카오 로그인 API Swagger
export const NaverLoginSwagger = (text: string) => {
  return BaseSwaggerDecorator(
    { summary: text },
    [
      {
        statusCode: 200,
        responseOptions: [
          {
            model: LoginResponse,
            exampleTitle: '성공',
            exampleDescription: '성공했을 때 값',
          },
        ],
        baseResponseDto: BaseResponse,
      },
    ],
    [],
  );
};

export const GetJwtInfoSwagger = (text: string) => {
  return BaseSwaggerDecorator(
    { summary: text },
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
      ApiInternalServerErrorResponse({
        type: ErrorCodeVo,
        description: '서버에서 발생한 오류',
      }),
    ],
  );
};
