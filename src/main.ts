import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './utils/swagger';
import { ServiceExceptionToHttpExceptionFilter } from './common/exception-filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new ServiceExceptionToHttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://oodd.today',
      'https://dev.oodd.today',
    ], // 프론트엔드에서 접근 가능한 도메인
    credentials: true,
  });
  setupSwagger(app);
  await app.listen(process.env.PORT);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
