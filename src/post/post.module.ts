import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../common/entities/post.entity';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { UserModule } from 'src/user/user.module';
import { PostStyletagModule } from 'src/post-styletag/post-styletag.module';
import { StyletagModule } from 'src/styletag/styletag.module';
import { UserBlockModule } from 'src/user-block/user-block.module';
import { PostClothingModule } from 'src/post-clothing/post-clothing.module';
import { PostImageModule } from 'src/post-image/post-image.module';
import { DayjsModule } from 'src/common/dayjs/dayjs.module';
import { PostLikeModule } from 'src/post-like/post-like.module';
import { PostCommentModule } from 'src/post-comment/post-comment.module';
import { MatchingModule } from 'src/matching/matching.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    PostImageModule,
    forwardRef(() => UserModule),
    StyletagModule,
    PostStyletagModule,
    UserBlockModule,
    PostClothingModule,
    DayjsModule,
    forwardRef(() => MatchingModule),
    forwardRef(() => PostLikeModule),
    forwardRef(() => PostCommentModule),
  ],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
