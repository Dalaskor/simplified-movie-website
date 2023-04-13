import { NestFactory } from '@nestjs/core';
import { StaffModule } from './staff.module';

async function bootstrap() {
  const app = await NestFactory.create(StaffModule);
  await app.listen(3000);
}
bootstrap();
