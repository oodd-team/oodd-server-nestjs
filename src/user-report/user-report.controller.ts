import { Controller, Post } from '@nestjs/common';
import { UserReportService } from './user-report.service';
import { PostUserReportSwagger } from './user-report.swagger';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('user-report')
@ApiTags('[서비스] 유저 신고')
export class UserReportController {
  constructor(private readonly userReportService: UserReportService) {}

  @Post()
  @PostUserReportSwagger('유저 신고하기 API')
  postUserReport() {
    // return this.userService.getHello();
  }
}
