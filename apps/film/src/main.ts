import { RmqService } from '@app/common';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { RmqOptions } from '@nestjs/microservices';
import { FilmModule } from './film.module';

async function bootstrap() {
  const app = await NestFactory.create(FilmModule);
  const rmqService = app.get<RmqService>(RmqService);

  app.enableCors({
    origin: '*',
    allowedHeaders: '*',
    exposedHeaders: '*',
  });
  app.connectMicroservice<RmqOptions>(rmqService.getOptions('FILM', false));
  app.useGlobalPipes(new ValidationPipe());

  await app.startAllMicroservices();
}
bootstrap();
