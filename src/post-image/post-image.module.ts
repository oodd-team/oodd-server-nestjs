import { Module } from '@nestjs/common';
import { PostImageService } from './post-image.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostImage])],
  providers: [PostImageService],
  exports: [PostImageService],
})
export class PostImageModule {}
