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
import { PatchUserRequest } from './dto/response/patch-user.request';
import { BaseResponse } from 'src/common/response/dto';
import { Request } from 'express';
import {
  DataNotFoundException,
  UnauthorizedException,
} from 'src/common/exception/service.exception';
import { PatchUserResponse } from './dto/response/patch-user.response';
import { GetOtherUserInfo } from './dto/response/get-user.response';
import { MatchingService } from 'src/matching/matching.service';

@ApiBearerAuth('Authorization')
@Controller('user')
@ApiTags('[서비스] 유저')
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
    const user = await this.userService.getUserById(userId);

    // 현재 사용자의 ID를 가져옵니다. req.user에서 추출할 수 있습니다.
    const currentUserId = req.user.id; // 또는 다른 방법으로 현재 사용자 ID를 가져옴

    // MatchingService를 통해 해당 사용자가 친구인지 확인
    const isFriend = await this.matchingService.existsMatching(
      currentUserId,
      userId,
    );

    return new BaseResponse<GetOtherUserInfo>(true, '유저 정보 조회 성공', {
      userId: user.id,
      name: user.name,
      phoneNumber: user.phoneNumber,
      email: user.email,
      nickname: user.nickname,
      profilePictureUrl: user.profilePictureUrl,
      bio: user.bio,
      isFriend: isFriend,
    });
  }

  @Patch(':userId/withdraw')
  @UseGuards(AuthGuard)
  @WithdrawSwagger('회원탈퇴 API')
  async withdrawUser(
    @Param('userId') userId: number,
    @Req() req: Request,
  ): Promise<BaseResponse<null>> {
    //console.log("req.user['id'] is ~~~~~~~~~~~~~~~~~",typeof(req.user['id']) );
    //console.log("Number(userId) is ~~~~~~~~~~~~~~~~~", typeof(Number(userId)));
    if (req.user['id'] != Number(userId)) {
      throw UnauthorizedException('권한이 없습니다.');
    }

    await this.userService.softDeleteUser(userId);

    return new BaseResponse<null>(true, 'USER_WITHDRAWED_SUCCESS', null);
  }

  @Patch(':userId')
  @UseGuards(AuthGuard)
  @PatchUserSwagger('유저 정보 수정 API')
  async patchUser(
    @Req() req: Request,
    @Param('userId') userId: number,
    @Body() body: PatchUserRequest,
  ): Promise<BaseResponse<PatchUserResponse>> {
    if (!(await this.userService.getUserById(userId)))
      throw DataNotFoundException('유저가 존재하지 않습니다.');
    if (req.user.id !== Number(userId)) {
      throw UnauthorizedException('권한이 없습니다.');
    }

    const updatedUser = await this.userService.PatchUser(userId, body);

    return new BaseResponse<PatchUserResponse>(true, '유저 정보 수정 성공', {
      userId: updatedUser.id,
      name: updatedUser.name,
      phoneNumber: updatedUser.phoneNumber,
      birthDate: updatedUser.birthDate,
      email: updatedUser.email,
      nickname: updatedUser.nickname,
      profilePictureUrl: updatedUser.profilePictureUrl,
      bio: updatedUser.bio,
    });
  }

  @Post(':userId')
  @UseGuards(AuthGuard)
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
