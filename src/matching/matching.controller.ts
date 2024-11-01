import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MatchingService } from './matching.service';
import {
  CreateMatchingSwagger,
  DeleteMatchingSwagger,
  GetMatchingsSwagger,
  GetMatchingSwagger,
  PatchMatchingRequestStatusSwagger,
} from './matching.swagger';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateMatchingReqeust } from './dto/matching.request';
import { UserService } from 'src/user/user.service';
import { Request } from 'express';
import {
  DataNotFoundException,
  UnauthorizedException,
} from 'src/common/exception/service.exception';
import { BaseResponse } from 'src/common/response/dto';
import { PostMatchingResponse } from './dto/matching.response';
import { AuthGuard } from 'src/auth/guards/jwt.auth.guard';

@ApiBearerAuth()
@Controller('matching')
@ApiTags('[서비스] 매칭')
export class MatchingController {
  constructor(
    private readonly matchingService: MatchingService,
    private readonly userService: UserService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  @CreateMatchingSwagger('매칭 생성 API')
  async createMatching(
    @Req() req: Request,
    @Body() body: CreateMatchingReqeust,
  ): Promise<BaseResponse<PostMatchingResponse>> {
    if (req.user.id !== body.requesterId)
      throw UnauthorizedException('권한이 없습니다.');

    if (!(await this.userService.getUserById(body.targetId)))
      throw DataNotFoundException('대상 유저가 존재하지 않습니다.');

    const chatRoom = await this.matchingService.createMatching(body);
    return new BaseResponse<PostMatchingResponse>(true, 'SUCCESS', {
      chatRoomId: chatRoom.id,
      toUserId: chatRoom.toUser.id,
      fromUserId: chatRoom.fromUser.id,
    });
  }

  @Patch()
  @PatchMatchingRequestStatusSwagger('매칭 요청 수락 및 거절 API')
  patchMatchingRequestStatus() {
    // return this.userService.getHello();
  }

  @Patch()
  @DeleteMatchingSwagger('매칭 삭제 API')
  deleteMatching() {
    // return this.userService.getHello()
  }

  @Get()
  @GetMatchingsSwagger('매칭 리스트 조회 API')
  getMatchings() {
    // return this.userService.getHello()
  }

  @Get()
  @GetMatchingSwagger('매칭 상세 조회 API')
  getMatching() {
    // return this.userService.getHello()
  }
}
