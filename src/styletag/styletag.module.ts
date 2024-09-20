import { Module } from '@nestjs/common';
import { StyletagController } from './styletag.controller';
import { StyletagService } from './styletag.service';

@Module({
  controllers: [StyletagController],
  providers: [StyletagService]
})
export class StyletagModule {}
