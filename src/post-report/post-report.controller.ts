import { Controller, Post } from '@nestjs/common';
import { PostReportService } from './post-report.service';
import { CreatePostReportSwagger } from './post-report.swagger';

@Controller('post-report')
export class PostReportController {
  constructor(private readonly postReportService: PostReportService) {}
  @Post()
  @CreatePostReportSwagger('게시글 신고하기 API')
  createPostReport() {
    // return this.userService.getHello();
  }
}
