import { Module } from '@nestjs/common';
import { PostImageController } from './post-image.controller';
import { PostImageService } from './post-image.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostImage } from 'src/common/entities/post-image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostImage])],
  controllers: [PostImageController],
  providers: [PostImageService],
  exports: [PostImageService],
})
export class PostImageModule {}
