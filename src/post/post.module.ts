import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../common/entities/post.entity';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { UserModule } from 'src/user/user.module';
import { UserBlockModule } from 'src/user-block/user-block.module';
import { PostImageModule } from 'src/post-image/post-image.module';
import { DayjsModule } from 'src/common/dayjs/dayjs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    PostImageModule,
    UserModule,
    UserBlockModule,
    DayjsModule,
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
