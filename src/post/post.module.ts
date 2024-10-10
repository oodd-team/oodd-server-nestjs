import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../common/entities/post.entity';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PostImageService } from 'src/post-image/post-image.service';
import { UserModule } from 'src/user/user.module';
import { PostImage } from 'src/common/entities/post-image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, PostImage]), UserModule],
  controllers: [PostController],
  providers: [PostService, PostImageService],
})
export class PostModule {}
