import { RmqService } from '@app/common';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { RmqOptions } from '@nestjs/microservices';
import { PageModule } from './page.module';

async function bootstrap() {
    const app = await NestFactory.create(PageModule);
    const rmqService = app.get<RmqService>(RmqService);

    app.enableCors();
    app.connectMicroservice<RmqOptions>(rmqService.getOptions('PAGE', false));
    app.useGlobalPipes(new ValidationPipe());

    await app.startAllMicroservices();
}
bootstrap();
