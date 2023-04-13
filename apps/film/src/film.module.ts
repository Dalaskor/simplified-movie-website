import { DatabaseModule, RmqModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Country } from 'apps/country/src/country.model';
import { Genre } from 'apps/genre/src/genre.model';
import { Staff } from 'apps/staff/src/staff.model';
import * as Joi from 'joi';
import { FilmController } from './film.controller';
import { Film } from './film.model';
import { FilmService } from './film.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: Joi.object({
                PORT: Joi.number().required(),
                RABBIT_MQ_URI: Joi.string().required(),
                RABBIT_MQ_FILM_QUEUE: Joi.string().required(),
                POSTGRES_URI: Joi.string().required(),
            }),
            envFilePath: './apps/auth/.env',
        }),
        DatabaseModule,
        SequelizeModule.forFeature([Film, Genre, Country, Staff]),
        RmqModule,
    ],
    controllers: [FilmController],
    providers: [FilmService],
})
export class FilmModule {}
