import { Module } from '@nestjs/common';
import { PostClothingController } from './post-clothing.controller';
import { PostClothingService } from './post-clothing.service';

@Module({
  controllers: [PostClothingController],
  providers: [PostClothingService]
})
export class PostClothingModule {}
