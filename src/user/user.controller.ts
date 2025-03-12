import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  GetUserSwagger,
  PatchUserSwagger,
  PatchUserTermsSwagger,
  WithdrawSwagger,
} from './user.swagger';
import { AuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { PatchUserRequest } from './dto/response/user.request';
import { BaseResponse } from 'src/common/response/dto';
import { Request } from 'express';
import {
  DataNotFoundException,
  UnauthorizedException,
} from 'src/common/exception/service.exception';
import { GetUserInfo } from './dto/response/user.response';
import { GetOtherUserInfo } from './dto/response/user.response';
import { MatchingService } from 'src/matching/matching.service';

@ApiBearerAuth('Authorization')
@Controller('user')
@ApiTags('[서비스] 유저')
@UseGuards(AuthGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly matchingService: MatchingService,
  ) {}

  // 특정 아이디로 다른 유저 정보 조회
  @Get(':userId')
  @GetUserSwagger('유저 정보 조회 API')
  async getUser(
    @Req() req: Request,
    @Param('userId') userId: number,
  ): Promise<BaseResponse<GetOtherUserInfo>> {
    const user = await this.userService.getUserWithTag(userId);
    if (!user) throw DataNotFoundException('존재하지 않는 사용자입니다.');
    // MatchingService를 통해 해당 사용자가 친구인지 확인
    const isMatching = await this.matchingService.isMatching(
      req.user.id,
      userId,
    );

    const otherUserInfo = new GetOtherUserInfo(user, isMatching);

    return new BaseResponse<GetOtherUserInfo>(
      true,
      '유저 정보 조회 성공',
      otherUserInfo,
    );
  }

  @Patch(':userId/withdraw')
  @WithdrawSwagger('회원탈퇴 API')
  async withdrawUser(
    @Param('userId') userId: number,
    @Req() req: Request,
  ): Promise<BaseResponse<null>> {
    if (req.user['id'] != Number(userId)) {
      throw UnauthorizedException('권한이 없습니다.');
    }

    await this.userService.softDeleteUser(userId);

    return new BaseResponse<null>(true, 'USER_WITHDRAWED_SUCCESS', null);
  }

  @Patch(':userId')
  @PatchUserSwagger('유저 정보 수정 API')
  async patchUser(
    @Req() req: Request,
    @Param('userId') userId: number,
    @Body() body: PatchUserRequest,
  ): Promise<BaseResponse<GetUserInfo>> {
    if (!(await this.userService.getUserById(userId)))
      throw DataNotFoundException('유저가 존재하지 않습니다.');
    if (req.user.id !== Number(userId)) {
      throw UnauthorizedException('권한이 없습니다.');
    }

    const updatedUser = await this.userService.PatchUser(userId, body);
    const updatedUserResponse = new GetUserInfo(updatedUser);

    return new BaseResponse<GetUserInfo>(
      true,
      '유저 정보 수정 성공',
      updatedUserResponse,
    );
  }

  @Post(':userId')
  @PatchUserTermsSwagger('이용약관 동의 API')
  async patchUserTerms(
    @Req() req: Request,
    @Param('userId') userId: number,
  ): Promise<BaseResponse<any>> {
    if (!(await this.userService.getUserById(userId)))
      throw DataNotFoundException('유저가 존재하지 않습니다.');
    if (req.user.id !== Number(userId)) {
      throw UnauthorizedException('권한이 없습니다.');
    }

    const updatedUser = await this.userService.patchUserTerms(userId);

    return new BaseResponse(true, 'Success', updatedUser.privacyTermAcceptedAt);
  }
}
