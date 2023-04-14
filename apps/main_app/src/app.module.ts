import { RmqModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import {
    COUNTRY_SERVICE,
    FILM_SERVICE,
    GENRE_SERVICE,
    STAFF_SERVICE,
} from '../constants/services';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: Joi.object({
                PORT: Joi.number().required(),
                RABBIT_MQ_URI: Joi.string().required(),
                POSTGRES_URI: Joi.string().required(),
            }),
            envFilePath: './apps/ ',
        }),
        RmqModule.register({ name: FILM_SERVICE }),
        RmqModule.register({ name: GENRE_SERVICE }),
        RmqModule.register({ name: STAFF_SERVICE }),
        RmqModule.register({ name: COUNTRY_SERVICE }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
