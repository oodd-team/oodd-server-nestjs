import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { UserBlockService } from './user-block.service';
import { CreateBlockUserSwagger } from './user-block.swagget';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateUserBlockDto } from './dtos/user-block.dto';
import { BaseResponse } from 'src/common/response/dto';
import { AuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { Request } from 'express';
import { UnauthorizedException } from 'src/common/exception/service.exception';

@ApiBearerAuth('Authorization')
@Controller('user-block')
@UseGuards(AuthGuard)
@ApiTags('[서비스] 유저 차단')
export class UserBlockController {
  constructor(private readonly userBlockService: UserBlockService) {}

  @Post()
  @CreateBlockUserSwagger('유저 차단하기 API')
  async createUserBlock(
    @Body() createUserBlockDto: CreateUserBlockDto,
    @Req() req: Request, 
  ): Promise<BaseResponse<null>> {
    const fromUserId = req.user['id']; 
    //console.log('fromUserId is ', fromUserId);

    createUserBlockDto.fromUserId = fromUserId;

  const resultCode = await this.userBlockService.createBlock(createUserBlockDto);

  if (resultCode === 'BLOCKED_SUCCESS') {
    return new BaseResponse<null>(true, 'BLOCKED_SUCCESS', null);
  } else if (resultCode === 'UNBLOCKED_SUCCESS') {
    return new BaseResponse<null>(true, 'UNBLOCKED_SUCCESS', null);
  }
  
}
}