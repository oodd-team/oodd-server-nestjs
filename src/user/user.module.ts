import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/common/entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { MatchingModule } from 'src/matching/matching.module';
import { UserStyletagModule } from 'src/user-styletag/user-styletag.module';
import { StyletagModule } from 'src/styletag/styletag.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
    forwardRef(() => MatchingModule),
    StyletagModule,
    UserStyletagModule,
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
