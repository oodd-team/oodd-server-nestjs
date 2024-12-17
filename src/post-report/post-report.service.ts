import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostReport } from '../common/entities/post-report.entity';
import { PostReportDto } from './dtos/post-report.dto';
import {
  DataNotFoundException,
  InvalidInputValueException,
} from 'src/common/exception/service.exception';
import { PostService } from '../post/post.service';
import { StatusEnum } from 'src/common/enum/entityStatus';

@Injectable()
export class PostReportService {
  constructor(
    @InjectRepository(PostReport)
    private readonly postReportRepository: Repository<PostReport>,
    private readonly postService: PostService,
  ) {}

  async reportPost(reportDto: PostReportDto): Promise<PostReport> {
    const post = await this.postService.findByFields({
      where: { id: reportDto.postId },
    });
    if (!post) {
      throw DataNotFoundException('신고하려는 게시글을 찾을 수 없습니다.');
    }

    // 이미 동일한 유저가 동일 게시글에 대해 신고했는지 확인
    const existingReport = await this.postReportRepository.findOne({
      where: {
        reporter: { id: reportDto.requesterId },
        post: { id: reportDto.postId },
        reason: reportDto.reason,
      },
    });

    if (existingReport) {
      throw InvalidInputValueException('이미 해당 게시글을 신고하였습니다.');
    }

    const postReport = this.postReportRepository.create({
      reporter: { id: reportDto.requesterId },
      post: post,
      reason: reportDto.reason,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: StatusEnum.ACTIVATED,
    });

    return await this.postReportRepository.save(postReport);
  }
}
