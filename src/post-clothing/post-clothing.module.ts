import { Module } from '@nestjs/common';
import { PostClothingController } from './post-clothing.controller';
import { PostClothingService } from './post-clothing.service';
import { PostClothing } from 'src/common/entities/post-clothing.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clothing } from 'src/common/entities/clothing.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostClothing, Clothing])],
  controllers: [PostClothingController],
  providers: [PostClothingService],
  exports: [PostClothingService],
})
export class PostClothingModule {}
