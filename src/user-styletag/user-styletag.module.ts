import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Styletag } from 'src/common/entities/styletag.entity';
import { UserStyletag } from 'src/common/entities/user-styletag.entity';
import { UserStyletagService } from './user-styletag.service';
import { StyletagService } from 'src/styletag/styletag.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserStyletag, Styletag])],
  providers: [UserStyletagService, StyletagService],
  exports: [UserStyletagService],
})
export class UserStyletagModule {}
