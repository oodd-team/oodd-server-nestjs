import { Module } from '@nestjs/common';
import { PostImageService } from './post-image.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostImage } from 'src/common/entities/post-image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostImage])],
  providers: [PostImageService],
  exports: [PostImageService],
})
export class PostImageModule {}
