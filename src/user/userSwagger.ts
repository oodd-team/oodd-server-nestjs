import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { BaseSwaggerDecorator } from 'nestjs-swagger-decorator';
import { GET_OK_RESPONSE } from 'src/common/constant.response';

export function GetUserSwagger(apiSummary) {
  return BaseSwaggerDecorator(
    apiSummary,
    [
      ApiOkResponse({ description: 'OK' }),
      ApiCreatedResponse({ description: 'created' }),
    ],
    [{ ...GET_OK_RESPONSE }],
  );
}
