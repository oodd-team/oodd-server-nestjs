import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clothing } from 'src/common/entities/clothing.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Clothing])],
})
export class ClothingModule {}
