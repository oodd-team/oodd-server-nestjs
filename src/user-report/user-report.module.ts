import { forwardRef, Module } from '@nestjs/common';
import { UserReportController } from './user-report.controller';
import { UserReportService } from './user-report.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserReport } from 'src/common/entities/user-report.entity';
import { User } from 'src/common/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserReport, User]), UserModule, forwardRef(() => AuthModule)], 
  providers: [UserReportService],
  controllers: [UserReportController],
  exports: [UserReportModule],
})
export class UserReportModule {}
