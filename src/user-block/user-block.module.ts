import { Module, forwardRef } from '@nestjs/common';
import { UserBlockController } from './user-block.controller';
import { UserBlockService } from './user-block.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserBlock } from 'src/common/entities/user-block.entity';
import { UserModule } from 'src/user/user.module';
import { User } from 'src/common/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserBlock, User]),
    forwardRef(() => UserModule),
  ],
  controllers: [UserBlockController],
  providers: [UserBlockService],
  exports: [UserBlockService],
})
export class UserBlockModule {}
