import {
  Body,
  Controller,
  forwardRef,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MatchingService } from './matching.service';
import {
  CreateMatchingSwagger,
  DeleteMatchingSwagger,
  getLatestMatchingSwagger,
  GetMatchingsSwagger,
  PatchMatchingRequestStatusSwagger,
} from './matching.swagger';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  CreateMatchingRequest,
  PatchMatchingRequest,
} from './dto/matching.request';
import { UserService } from 'src/user/user.service';
import { Request } from 'express';
import {
  DataNotFoundException,
  InvalidInputValueException,
  UnauthorizedException,
} from 'src/common/exception/service.exception';
import { BaseResponse } from 'src/common/response/dto';
import {
  PatchMatchingResponse,
  CreateMatchingResponse,
  GetMatchingsResponse,
  GetOneMatchingResponse,
} from './dto/matching.response';
import { AuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { PostService } from 'src/post/post.service';
import { ChatRoomService } from 'src/chat-room/chat-room.service';
import { StatusEnum } from 'src/common/enum/entityStatus';
import { MatchingRequestStatusEnum } from 'src/common/enum/matchingRequestStatus';

@ApiBearerAuth('Authorization')
@Controller('matching')
@ApiTags('[서비스] 매칭')
export class MatchingController {
  constructor(
    private readonly matchingService: MatchingService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly postService: PostService,
    private readonly chatRoomService: ChatRoomService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  @CreateMatchingSwagger('매칭 생성 API')
  async createMatching(
    @Req() req: Request,
    @Body() body: CreateMatchingRequest,
  ): Promise<BaseResponse<CreateMatchingResponse>> {
    if (req.user.id !== body.requesterId)
      throw UnauthorizedException('권한이 없습니다.');

    if (!(await this.userService.getUserById(body.targetId)))
      throw DataNotFoundException('대상 유저가 존재하지 않습니다.');

    if (
      !(await this.postService.findByFields({
        where: {
          user: { id: body.requesterId },
          status: StatusEnum.ACTIVATED,
        },
      }))
    ) {
      throw DataNotFoundException('신청 유저의 게시물이 존재하지 않습니다.');
    }

    if (
      await this.matchingService.existsMatching(body.requesterId, body.targetId)
    )
      throw InvalidInputValueException('이미 매칭 요청을 보냈습니다.');

    const matching = await this.matchingService.createMatching(body);
    return new BaseResponse<CreateMatchingResponse>(true, 'SUCCESS', matching);
  }

  @Patch(':matchingId')
  @UseGuards(AuthGuard)
  @PatchMatchingRequestStatusSwagger('매칭 요청 수락 및 거절 API')
  async patchMatchingRequestStatus(
    @Req() req: Request,
    @Param('matchingId') matchingId: number,
    @Body() body: PatchMatchingRequest,
  ): Promise<BaseResponse<PatchMatchingResponse>> {
    const matching = await this.matchingService.getMatchingById(matchingId);
    const chatRoom = await this.chatRoomService.getChatRoomByMatchingId(
      matching.id,
    );
    if (!matching) {
      throw DataNotFoundException('해당 매칭 요청을 찾을 수 없습니다.');
    }
    if (req.user.id !== matching.target.id) {
      throw UnauthorizedException('권한이 없습니다.');
    }
    if (matching.requestStatus !== MatchingRequestStatusEnum.PENDING) {
      throw InvalidInputValueException('이미 처리된 요청입니다.');
    }
    if (!chatRoom) {
      throw DataNotFoundException('채팅방을 찾을 수 없습니다.');
    }

    await this.matchingService.patchMatchingRequestStatus(matching, body);
    return new BaseResponse<PatchMatchingResponse>(
      true,
      '매칭 상태 변경 성공',
      {
        id: matching.id,
        requesterId: matching.requester.id,
        targetId: matching.target.id,
        requestStatus: matching.requestStatus,
        chatRoomId: chatRoom.id,
      },
    );
  }

  @Patch()
  @DeleteMatchingSwagger('매칭 삭제 API')
  deleteMatching() {
    // return this.userService.getHello()
  }

  @Get()
  @UseGuards(AuthGuard)
  @GetMatchingsSwagger('매칭 리스트 조회 API')
  async getMatchings(
    @Req() req: Request,
  ): Promise<BaseResponse<GetMatchingsResponse>> {
    const response = await this.matchingService.getMatchings(req.user.id);
    return new BaseResponse(true, 'SUCCESS', response);
  }

  @Get('latest')
  @UseGuards(AuthGuard)
  @getLatestMatchingSwagger('최근 매칭 조회 API')
  async getLatestMatching(
    @Req() req: Request,
  ): Promise<BaseResponse<GetOneMatchingResponse>> {
    const matching = await this.matchingService.getLatestMatching(req.user.id);
    if (!matching) {
      throw DataNotFoundException('매칭을 찾을 수 없습니다.');
    }
    return new BaseResponse<GetOneMatchingResponse>(true, '매칭 조회 성공', {
      id: matching.id,
      requesterId: matching.requester.id,
      targetId: matching.target.id,
      requestStatus: matching.requestStatus,
    });
  }
}
