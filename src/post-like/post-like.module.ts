import { Module } from '@nestjs/common';
import { PostLikeController } from './post-like.controller';
import { PostLikeService } from './post-like.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostLike } from 'src/common/entities/post-like.entity';
import { PostModule } from 'src/post/post.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostLike]), // PostLikeRepository 사용을 위한 설정
    PostModule, // PostService를 사용하기 위한 PostModule 가져오기
  ],
  controllers: [PostLikeController],
  providers: [PostLikeService]
})
export class PostLikeModule {}
