import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clothing } from 'src/common/entities/clothing.entity';
import { ClothingService } from './clothing.service';

@Module({
  imports: [TypeOrmModule.forFeature([Clothing])],
  providers: [ClothingService],
  exports: [ClothingService],
})
export class ClothingModule {}
