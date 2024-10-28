import { Module } from '@nestjs/common';
import { PostReportController } from './post-report.controller';
import { PostReportService } from './post-report.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostReport } from 'src/common/entities/post-report.entity';
import { PostModule } from 'src/post/post.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostReport]), 
    PostModule,
  ],
  controllers: [PostReportController],
  providers: [PostReportService]
})
export class PostReportModule {}
