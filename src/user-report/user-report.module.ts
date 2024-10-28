import { Module } from '@nestjs/common';
import { UserReportController } from './user-report.controller';
import { UserReportService } from './user-report.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserReport } from 'src/common/entities/user-report.entity';
import { User } from 'src/common/entities/user.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserReport, User]),
    UserModule, 
  ],  
  providers: [UserReportService],
  controllers: [UserReportController],
  exports: [UserReportModule],
})
export class UserReportModule {}
