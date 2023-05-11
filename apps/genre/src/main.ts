import { RmqService } from '@app/common';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { RmqOptions } from '@nestjs/microservices';
import { GenreModule } from './genre.module';

async function bootstrap() {
  const app = await NestFactory.create(GenreModule);
  const rmqService = app.get<RmqService>(RmqService);

  app.enableCors();
  app.connectMicroservice<RmqOptions>(rmqService.getOptions('GENRE', false));
  app.useGlobalPipes(new ValidationPipe());

  await app.startAllMicroservices();
}
bootstrap();
