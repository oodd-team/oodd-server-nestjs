import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { PostReportService } from './post-report.service';
import { CreatePostReportSwagger } from './post-report.swagger';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PostReportDto } from './dtos/post-report.dto';
import { BaseResponse } from 'src/common/response/dto';
import { AuthGuard } from 'src/auth/guards/jwt.auth.guard'; 
import { Request } from 'express';

@ApiBearerAuth('Authorization')
@Controller('post-report')
@UseGuards(AuthGuard) 
@ApiTags('[서비스] 게시글 신고')
export class PostReportController {
  constructor(private readonly postReportService: PostReportService) {}
  @Post()
  @CreatePostReportSwagger('게시글 신고하기 API')
  async createPostReport(
    @Body() postReportDto: PostReportDto,
    @Req() req: Request 
  ): Promise<BaseResponse<string>> {
    const requesterId = req.user['id'];
    
    await this.postReportService.reportPost({
      ...postReportDto,
      requesterId,
    });

    return new BaseResponse(true, 'SUCCESS', '신고 완료');
  }
}