import { Module } from '@nestjs/common';
import { PostCommentController } from './post-comment.controller';
import { PostCommentService } from './post-comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostComment } from 'src/common/entities/post-comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostComment])],
  controllers: [PostCommentController],
  providers: [PostCommentService],
  exports: [PostCommentService],
})
export class PostCommentModule {}
