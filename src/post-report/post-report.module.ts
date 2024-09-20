import { Module } from '@nestjs/common';
import { PostReportController } from './post-report.controller';
import { PostReportService } from './post-report.service';

@Module({
  controllers: [PostReportController],
  providers: [PostReportService]
})
export class PostReportModule {}
