import { Controller, Post } from '@nestjs/common';
import { UserReportService } from './user-report.service';
import { PostUserReportSwagger } from './user-report.swagger';

@Controller('user-report')
export class UserReportController {
  constructor(private readonly userReportService: UserReportService) {}

  @Post()
  @PostUserReportSwagger('유저 신고하기 API')
  postUserReport() {
    // return this.userService.getHello();
  }
}
