import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
