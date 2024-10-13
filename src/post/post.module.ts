import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../common/entities/post.entity';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PostImageService } from 'src/post-image/post-image.service';
import { UserModule } from 'src/user/user.module';
import { PostImage } from 'src/common/entities/post-image.entity';
import { PostStyletagService } from 'src/post-styletag/post-styletag.service';
import { PostStyletagModule } from 'src/post-styletag/post-styletag.module';
import { PostStyletag } from 'src/common/entities/post-styletag.entity';
import { StyletagModule } from 'src/styletag/styletag.module';
import { StyletagService } from 'src/styletag/styletag.service';
import { Styletag } from 'src/common/entities/styletag.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, PostImage, PostStyletag, Styletag]),
    UserModule,
    StyletagModule,
    PostStyletagModule,
  ],
  controllers: [PostController],
  providers: [
    PostService,
    PostImageService,
    PostStyletagService,
    StyletagService,
  ],
})
export class PostModule {}
