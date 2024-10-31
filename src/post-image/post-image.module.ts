import { Module } from '@nestjs/common';
import { PostImageController } from './post-image.controller';
import { PostImageService } from './post-image.service';

@Module({
  controllers: [PostImageController],
  providers: [PostImageService]
})
export class PostImageModule {}
