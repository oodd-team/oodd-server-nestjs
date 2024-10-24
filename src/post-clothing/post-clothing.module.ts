import { Module } from '@nestjs/common';
import { PostClothingController } from './post-clothing.controller';
import { PostClothingService } from './post-clothing.service';
import { PostClothing } from 'src/common/entities/post-clothing.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClothingModule } from 'src/clothing/clothing.module';

@Module({
  imports: [TypeOrmModule.forFeature([PostClothing]), ClothingModule],
  controllers: [PostClothingController],
  providers: [PostClothingService],
  exports: [PostClothingService],
})
export class PostClothingModule {}
