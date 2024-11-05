import { Body, Controller, Post, Req } from '@nestjs/common';
import { PostReportService } from './post-report.service';
import { CreatePostReportSwagger } from './post-report.swagger';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PostReportDto } from './dtos/post-report.dto';
import { BaseResponse } from 'src/common/response/dto';

@ApiBearerAuth('Authorization')
@Controller('post-report')
@ApiTags('[서비스] 게시글 신고')
export class PostReportController {
  constructor(private readonly postReportService: PostReportService) {}
  @Post()
  @CreatePostReportSwagger('게시글 신고하기 API')
  async createPostReport(
    @Body() postReportDto: PostReportDto,
    @Req() req: any 
  ): Promise<BaseResponse<string>> {
    const requesterId = 1; // 추후 수정
    
    await this.postReportService.reportPost({
      ...postReportDto,
      requesterId,
    });

    return new BaseResponse(true, 'SUCCESS', '신고 완료');
  }
}