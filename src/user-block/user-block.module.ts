import { Module } from '@nestjs/common';
import { UserBlockController } from './user-block.controller';
import { UserBlockService } from './user-block.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserBlock } from 'src/common/entities/user-block.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserBlock])],
  controllers: [UserBlockController],
  providers: [UserBlockService],
  exports: [UserBlockService],
})
export class UserBlockModule {}
