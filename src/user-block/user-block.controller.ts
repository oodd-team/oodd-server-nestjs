import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { UserBlockService } from './user-block.service';
import { CreateBlockUserSwagger } from './user-block.swagget';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserBlockRequest } from './dtos/user-block.request';
import { BaseResponse } from 'src/common/response/dto';
import { AuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { Request } from 'express';

@ApiBearerAuth('Authorization')
@Controller('user-block')
@UseGuards(AuthGuard)
@ApiTags('[서비스] 유저 차단')
export class UserBlockController {
  constructor(private readonly userBlockService: UserBlockService) {}

  @Post()
  @CreateBlockUserSwagger('유저 차단하기 API')
  async createUserBlock(
    @Body() createUserBlockDto: UserBlockRequest,
    @Req() req: Request,
  ): Promise<BaseResponse<null>> {
    createUserBlockDto.requesterId = req.user.id;
    const resultCode =
      await this.userBlockService.createBlock(createUserBlockDto);

    if (resultCode === 'BLOCKED_SUCCESS') {
      return new BaseResponse<null>(true, 'BLOCKED_SUCCESS', null);
    } else if (resultCode === 'UNBLOCKED_SUCCESS') {
      return new BaseResponse<null>(true, 'UNBLOCKED_SUCCESS', null);
    }
  }
}
