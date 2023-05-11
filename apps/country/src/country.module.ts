import { DatabaseModule, RmqModule } from '@app/common';
import { Country } from '@app/models';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import * as Joi from 'joi';
import { CountryController } from './country.controller';
import { CountryService } from './country.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_COUNTRY_QUEUE: Joi.string().required(),
        POSTGRES_URI: Joi.string().required(),
      }),
      envFilePath: './apps/country/.env',
    }),
    DatabaseModule,
    SequelizeModule.forFeature([Country]),
    RmqModule,
  ],
  controllers: [CountryController],
  providers: [CountryService],
})
export class CountryModule {}
