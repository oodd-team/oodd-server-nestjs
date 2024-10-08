import { BaseSwaggerDecorator } from 'nestjs-swagger-decorator';
import { LoginResponse } from './dto/auth.response';
import { BaseResponse } from 'src/common/response/dto';

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
    [],
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
