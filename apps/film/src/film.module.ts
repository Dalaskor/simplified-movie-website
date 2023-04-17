import { DatabaseModule, RmqModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Country } from 'apps/country/src/country.model';
import { CountryModule } from 'apps/country/src/country.module';
import { FilmGenres } from 'apps/genre/src/film-genres.model';
import { Genre } from 'apps/genre/src/genre.model';
import { GenreModule } from 'apps/genre/src/genre.module';
import { Staff } from 'apps/staff/src/staff.model';
import { StaffModule } from 'apps/staff/src/staff.module';
import * as Joi from 'joi';
import {
    COUNTRY_SERVICE,
    GENRE_SERVICE,
    STAFF_SERVICE,
} from '../constants/services';
import { FilmCountries } from './film-country.model';
import { FilmSpectators } from './film-spectator.model';
import {
    FilmActors,
    FilmArtists,
    FilmCompositors,
    FilmDirectors,
    FilmMontages,
    FilmOperators,
} from './film-staff.model';
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
            envFilePath: './apps/film/.env',
        }),
        DatabaseModule,
        SequelizeModule.forFeature([
            Film,
            Genre,
            Country,
            Staff,
            FilmGenres,
            FilmOperators,
            FilmCompositors,
            FilmActors,
            FilmArtists,
            FilmDirectors,
            FilmMontages,
            FilmSpectators,
            FilmCountries,
        ]),
        RmqModule,
        RmqModule.register({ name: STAFF_SERVICE }),
        RmqModule.register({ name: COUNTRY_SERVICE }),
        RmqModule.register({ name: GENRE_SERVICE }),
        GenreModule,
        CountryModule,
        StaffModule,
    ],
    controllers: [FilmController],
    providers: [FilmService],
})
export class FilmModule {}
