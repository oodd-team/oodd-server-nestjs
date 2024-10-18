import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserReport } from '../common/entities/user-report.entity';
import { CreateUserReportDto } from '../user-report/dto/user-report.dto';
import { User } from '../common/entities/user.entity';
import { DataNotFoundException } from 'src/common/exception/service.exception';
import { UserService } from 'src/user/user.service';
import { USER_NOT_FOUND } from 'src/common/exception/error';

@Injectable()
export class UserReportService {
  constructor(
    @InjectRepository(UserReport)
    private readonly userReportRepository: Repository<UserReport>,
    @InjectRepository(User)
    private readonly userService: UserService, 
  ) {}

  async createReport(createUserReportDto: CreateUserReportDto): Promise<void> {
    const { fromUserId, toUserId, reason } = createUserReportDto;

    const fromUser = await this.userService.findByFields({
      where: { id: fromUserId, status: 'activated' },
    });
    const toUser = await this.userService.findByFields({
      where: { id: toUserId, status: 'activated' },
    });

    if (!fromUser || !toUser) {
        throw DataNotFoundException(USER_NOT_FOUND.message);
    }

    const userReport = this.userReportRepository.create({
      fromUser,
      toUser,
      reason,
    });

    await this.userReportRepository.save(userReport);
  }
}
