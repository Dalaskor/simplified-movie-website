import { DatabaseModule, RmqModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import * as Joi from 'joi';
import { CountryController } from './country.controller';
import { Country } from './country.model';
import { CountryService } from './country.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: Joi.object({
                PORT: Joi.number().required(),
                RABBIT_MQ_URI: Joi.string().required(),
                RABBIT_MQ_COUNTRY_QUEUE: Joi.string().required(),
                POSTGRES_URI: Joi.string().required(),
            }),
            envFilePath: './apps/auth/.env',
        }),
        DatabaseModule,
        SequelizeModule.forFeature([Country]),
        RmqModule,
    ],
    controllers: [CountryController],
    providers: [CountryService],
})
export class CountryModule {}
