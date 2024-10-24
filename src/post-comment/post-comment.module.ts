import { Module } from '@nestjs/common';
import { PostCommentController } from './post-comment.controller';
import { PostCommentService } from './post-comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostComment } from 'src/common/entities/post-comment.entity';
import { PostModule } from 'src/post/post.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([PostComment]), PostModule, UserModule],
  controllers: [PostCommentController],
  providers: [PostCommentService],
})
export class PostCommentModule {}
