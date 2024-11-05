import { Body, Controller, Patch, Post, UseGuards } from '@nestjs/common';
import { UserReportService } from './user-report.service';
import { PostUserReportSwagger } from './user-report.swagger';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateUserReportDto } from './dto/user-report.dto';
import { BaseResponse } from 'src/common/response/dto';

@ApiBearerAuth('Authorization')
@Controller('user-report')
@ApiTags('[서비스] 유저 신고')
export class UserReportController {
  constructor(private readonly userReportService: UserReportService) {}

  @Post()
  @PostUserReportSwagger('유저 신고하기 API')
  async postUserReport(
    @Body() createUserReportDto: CreateUserReportDto,
  ): Promise<BaseResponse<null>> {
    const fromUserId = 1; // 나중에 인증 로직 완성되면 유저 인증하자
    createUserReportDto.fromUserId = fromUserId; 

    await this.userReportService.createReport(createUserReportDto);

    return new BaseResponse<null>(true, 'USER_REPORTED_SUCCESS', null);
  }
}