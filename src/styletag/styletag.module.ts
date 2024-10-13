import { Module } from '@nestjs/common';
import { StyletagController } from './styletag.controller';
import { StyletagService } from './styletag.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Styletag } from 'src/common/entities/styletag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Styletag])],
  controllers: [StyletagController],
  providers: [StyletagService],
})
export class StyletagModule {}
