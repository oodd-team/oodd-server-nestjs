import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserReport } from '../common/entities/user-report.entity';
import { CreateUserReportDto } from '../user-report/dto/user-report.dto';
import {
  DataNotFoundException,
  InvalidInputValueException,
} from 'src/common/exception/service.exception';
import { UserService } from 'src/user/user.service';
import { StatusEnum } from 'src/common/enum/entityStatus';

@Injectable()
export class UserReportService {
  constructor(
    @InjectRepository(UserReport)
    private readonly userReportRepository: Repository<UserReport>,
    private readonly userService: UserService,
  ) {}

  async createReport(createUserReportDto: CreateUserReportDto): Promise<void> {
    const { fromUserId, toUserId, reason } = createUserReportDto;

    const fromUser = await this.userService.findByFields({
      where: { id: fromUserId, status: StatusEnum.ACTIVATED },
    });
    const toUser = await this.userService.findByFields({
      where: { id: toUserId, status: StatusEnum.ACTIVATED },
    });

    if (!fromUser || !toUser) {
      throw DataNotFoundException('유저를 찾을 수 없습니다.');
    }

    // 중복 신고 확인
    const existingReport = await this.userReportRepository
      .createQueryBuilder('report')
      .where('report.fromUser = :fromUserId', { fromUserId })
      .andWhere('report.toUser = :toUserId', { toUserId })
      .andWhere('report.reason = :reason', { reason })
      .getOne();

    if (existingReport) {
      throw InvalidInputValueException('이미 해당 유저를 신고하였습니다.');
    }

    const userReport = this.userReportRepository.create({
      fromUser,
      toUser,
      reason,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: StatusEnum.ACTIVATED,
    });

    await this.userReportRepository.save(userReport);
  }
}
