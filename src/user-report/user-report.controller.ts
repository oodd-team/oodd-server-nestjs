import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { UserReportService } from './user-report.service';
import { PostUserReportSwagger } from './user-report.swagger';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateUserReportDto } from './dto/user-report.dto';
import { BaseResponse } from 'src/common/response/dto';
import { AuthGuard } from 'src/auth/guards/jwt.auth.guard'; 
import { Request } from 'express';
import { UnauthorizedException } from 'src/common/exception/service.exception';

@ApiBearerAuth('Authorization')
@Controller('user-report')
@UseGuards(AuthGuard)
@ApiTags('[서비스] 유저 신고')
export class UserReportController {
  constructor(private readonly userReportService: UserReportService) {}

  @Post()
  @PostUserReportSwagger('유저 신고하기 API')
  async postUserReport(
    @Body() createUserReportDto: CreateUserReportDto,
    @Req() req: Request
  ): Promise<BaseResponse<null>> {
    const fromUserId = req.user['id'];
    //console.log("fromUserId is ~~~~~~~~~~~~~", fromUserId);
    //console.log("createUserReportDto.fromUserId is ~~~~~~~~~~~~~", createUserReportDto.fromUserId);
    
    // jwt 유저와 신고할 유저가 다른 경우
    if (fromUserId != createUserReportDto.fromUserId) {
      throw UnauthorizedException('신고 권한이 없습니다.');
    }

    createUserReportDto.fromUserId = fromUserId; 

    await this.userReportService.createReport(createUserReportDto);

    return new BaseResponse<null>(true, 'USER_REPORTED_SUCCESS', null);
  }
}

/* 
TODO
- userReport 중복 생성 
- jwt 인증 받은 사람이 아니더라도 신고가 됨 -> 인가 
*/