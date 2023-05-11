import { RmqService } from '@app/common';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { RmqOptions } from '@nestjs/microservices';
import { StaffModule } from './staff.module';

async function bootstrap() {
  const app = await NestFactory.create(StaffModule);
  const rmqService = app.get<RmqService>(RmqService);

  app.enableCors();
  app.connectMicroservice<RmqOptions>(rmqService.getOptions('STAFF', false));
  app.useGlobalPipes(new ValidationPipe());

  await app.startAllMicroservices();
}
bootstrap();
