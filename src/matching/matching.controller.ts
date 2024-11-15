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
  InternalServerException,
  UnauthorizedException,
} from 'src/common/exception/service.exception';
import { BaseResponse } from 'src/common/response/dto';
import { PostMatchingResponse } from './dto/matching.response';
import { AuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { PatchMatchingRequestDto } from './dto/Patch-matching.request';
import { GetMatchingsResponse } from './dto/get-matching.response';

@ApiBearerAuth('Authorization')
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
  @UseGuards(AuthGuard)
  @PatchMatchingRequestStatusSwagger('매칭 요청 수락 및 거절 API')
  async patchMatchingRequestStatus(
    @Req() req: Request,
    @Body() body: PatchMatchingRequestDto,
  ): Promise<BaseResponse<any>> {
    if (req.user.id !== body.targetId) {
      throw UnauthorizedException('권한이 없습니다.');
    }

    if (
      (await this.matchingService.getMatchingById(body.matchingId))
        .requestStatus !== 'pending'
    ) {
      throw InternalServerException('이미 처리된 요청입니다.');
    }

    await this.matchingService.patchMatchingRequestStatus(body);
    return new BaseResponse(true, '매칭 상태 변경 성공');
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
    const matchings = await this.matchingService.getMatchings(req.user.id);
    const response: GetMatchingsResponse = {
      isMatching: true,
      matchingCount: matchings.length,
      matching: matchings.map((matching) => {
        const requesterPost =
          matching.requester.posts.find((post) => post.isRepresentative) ||
          matching.requester.posts.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )[0];

        return {
          matchingId: matching.id,
          requester: {
            requesterId: matching.requester.id,
            nickname: matching.requester.nickname,
            profilePictureUrl: matching.requester.profilePictureUrl,
          },
          requesterPost: {
            postImages: requesterPost.postImages.map((image) => ({
              url: image.url,
              orderNum: image.orderNum,
            })),
            styleTags: requesterPost.postStyletags
              ? requesterPost.postStyletags.map(
                  (styleTag) => styleTag.styletag.tag,
                )
              : [],
          },
        };
      }),
    };
    return new BaseResponse(true, 'SUCCESS', response);
  }

  @Get()
  @GetMatchingSwagger('매칭 상세 조회 API')
  getMatching() {
    // return this.userService.getHello()
  }
}
