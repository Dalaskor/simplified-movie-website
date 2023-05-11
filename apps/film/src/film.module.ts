import {
  DatabaseModule,
  RmqModule,
  COUNTRY_SERVICE,
  GENRE_SERVICE,
  STAFF_SERVICE,
  SCORE_SERVICE,
  REVIEW_SERVICE,
} from '@app/common';
import {
  Country,
  Film,
  FilmActors,
  FilmArtists,
  FilmCompositors,
  FilmCountries,
  FilmDirectors,
  FilmGenres,
  FilmMontages,
  FilmOperators,
  FilmScenario,
  FilmScores,
  FilmSpectators,
  Genre,
  Score,
  Spectators,
  Staff,
} from '@app/models';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { CountryModule } from 'apps/country/src/country.module';
import { GenreModule } from 'apps/genre/src/genre.module';
import { StaffModule } from 'apps/staff/src/staff.module';
import * as Joi from 'joi';
import { FilmController } from './film.controller';
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
      Spectators,
      Score,
      FilmGenres,
      FilmOperators,
      FilmCompositors,
      FilmActors,
      FilmArtists,
      FilmDirectors,
      FilmMontages,
      FilmScenario,
      FilmCountries,
      FilmSpectators,
      FilmScores,
    ]),
    RmqModule,
    RmqModule.register({ name: STAFF_SERVICE }),
    RmqModule.register({ name: COUNTRY_SERVICE }),
    RmqModule.register({ name: GENRE_SERVICE }),
    RmqModule.register({ name: SCORE_SERVICE }),
    RmqModule.register({ name: REVIEW_SERVICE }),
    GenreModule,
    CountryModule,
    StaffModule,
  ],
  controllers: [FilmController],
  providers: [FilmService],
})
export class FilmModule {}
