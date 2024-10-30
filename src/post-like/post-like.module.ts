import { Module } from '@nestjs/common';
import { PostLikeController } from './post-like.controller';
import { PostLikeService } from './post-like.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostLike } from 'src/common/entities/post-like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostLike])],
  controllers: [PostLikeController],
  providers: [PostLikeService],
  exports: [PostLikeService],
})
export class PostLikeModule {}
