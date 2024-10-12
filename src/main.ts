import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './utils/swagger';
import { ServiceExceptionToHttpExceptionFilter } from './common/exception-filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new ServiceExceptionToHttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  setupSwagger(app);
  await app.listen(8080);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
