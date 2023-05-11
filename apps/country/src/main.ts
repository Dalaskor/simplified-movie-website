import { RmqService } from '@app/common';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { RmqOptions } from '@nestjs/microservices';
import { CountryModule } from './country.module';

async function bootstrap() {
  const app = await NestFactory.create(CountryModule);
  const rmqService = app.get<RmqService>(RmqService);

  app.enableCors();
  app.connectMicroservice<RmqOptions>(rmqService.getOptions('COUNTRY', false));
  app.useGlobalPipes(new ValidationPipe());

  await app.startAllMicroservices();
}
bootstrap();
