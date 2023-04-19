import {
    AuthModule,
    RmqModule,
    COUNTRY_SERVICE,
    FILM_SERVICE,
    GENRE_SERVICE,
    STAFF_SERVICE,
} from '@app/common';
import { GoogleStrategy } from '@app/common/auth/google.strategy';
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
                GOOGLE_CLIENT_ID: Joi.string().required(),
                GOOGLE_SECRET: Joi.string().required(),
            }),
            envFilePath: './apps/main_app/.env',
        }),
        RmqModule.register({ name: FILM_SERVICE }),
        RmqModule.register({ name: GENRE_SERVICE }),
        RmqModule.register({ name: STAFF_SERVICE }),
        RmqModule.register({ name: COUNTRY_SERVICE }),
        forwardRef(() => AuthModule),
    ],
    controllers: [AppController],
    providers: [AppService, GoogleStrategy],
})
export class AppModule {}
