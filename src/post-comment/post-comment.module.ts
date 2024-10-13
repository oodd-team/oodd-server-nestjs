import { Module } from '@nestjs/common';
import { PostCommentController } from './post-comment.controller';
import { PostCommentService } from './post-comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostComment } from 'src/common/entities/post-comment.entity';
import { Post } from 'src/common/entities/post.entity';
import { User } from 'src/common/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostComment, Post, User])],
  controllers: [PostCommentController],
  providers: [PostCommentService],
})
export class PostCommentModule {}
