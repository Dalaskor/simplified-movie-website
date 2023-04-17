import {
    AuthModule,
    COUNTRY_SERVICE,
    FILM_SERVICE,
    GENRE_SERVICE,
    RmqModule,
    STAFF_SERVICE,
} from '@app/common';
import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: Joi.object({
                PORT: Joi.number().required(),
            }),
            envFilePath: './apps/main_app/.env',
        }),
        forwardRef(() => AuthModule),
        RmqModule.register({ name: FILM_SERVICE }),
        RmqModule.register({ name: GENRE_SERVICE }),
        RmqModule.register({ name: STAFF_SERVICE }),
        RmqModule.register({ name: COUNTRY_SERVICE }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
