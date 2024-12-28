import { Module } from '@nestjs/common';
import { StyletagService } from './styletag.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Styletag } from 'src/common/entities/styletag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Styletag])],
  providers: [StyletagService],
})
export class StyletagModule {}
