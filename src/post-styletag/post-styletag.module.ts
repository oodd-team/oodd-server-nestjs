import { Module } from '@nestjs/common';
import { PostStyletagController } from './post-styletag.controller';
import { PostStyletagService } from './post-styletag.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostStyletag } from 'src/common/entities/post-styletag.entity';
import { Styletag } from 'src/common/entities/styletag.entity';
import { StyletagService } from 'src/styletag/styletag.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostStyletag, Styletag])],
  controllers: [PostStyletagController],
  providers: [PostStyletagService, StyletagService],
  exports: [PostStyletagService],
})
export class PostStyletagModule {}
