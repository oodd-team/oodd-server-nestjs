import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ChatMessageModule } from './chat-message/chat-message.module';
import { ChatRoomModule } from './chat-room/chat-room.module';
import { ClothingModule } from './clothing/clothing.module';
import { MatchingModule } from './matching/matching.module';
import { PostClothingModule } from './post-clothing/post-clothing.module';
import { PostCommentModule } from './post-comment/post-comment.module';
import { PostImageModule } from './post-image/post-image.module';
import { PostLikeModule } from './post-like/post-like.module';
import { PostReportModule } from './post-report/post-report.module';
import { PostStyletagModule } from './post-styletag/post-styletag.module';
import { PostModule } from './post/post.module';
import { StyletagModule } from './styletag/styletag.module';
import { UserBlockModule } from './user-block/user-block.module';
import { UserReportModule } from './user-report/user-report.module';
import { AuthModule } from './auth/auth.module';
import { DayjsModule } from './common/dayjs/dayjs.module';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DayjsModule, // DayjsModule 추가
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DEV_DB_HOST
        ? process.env.DEV_DB_HOST
        : process.env.DB_HOST,
      port: 3306,
      username: process.env.DEV_DB_USER
        ? process.env.DEV_DB_USER
        : process.env.DB_USER,
      password: process.env.DEV_DB_PASSWORD
        ? process.env.DEV_DB_PASSWORD
        : process.env.DB_PASSWORD,
      database: process.env.DEV_DB_DATABASE
        ? process.env.DEV_DB_DATABASE
        : process.env.DB_DATABASE, // 스키마 이름
      entities: [__dirname + '/common/entities/*.entity.{js,ts}'], // 모델의 경로
      logging: true, // 정확히 어떤 sql 쿼리가 실행됐는지 로그 출력
      synchronize: false, // 현재 entity 와 실제 데이터베이스 상 모델을 동기화
    }),
    ChatMessageModule,
    ChatRoomModule,
    ClothingModule,
    MatchingModule,
    PostClothingModule,
    PostCommentModule,
    PostImageModule,
    PostLikeModule,
    PostReportModule,
    PostStyletagModule,
    PostModule,
    StyletagModule,
    UserBlockModule,
    UserReportModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
