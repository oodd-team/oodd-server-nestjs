import { Module } from '@nestjs/common';
import { PostStyletagController } from './post-styletag.controller';
import { PostStyletagService } from './post-styletag.service';

@Module({
  controllers: [PostStyletagController],
  providers: [PostStyletagService]
})
export class PostStyletagModule {}
