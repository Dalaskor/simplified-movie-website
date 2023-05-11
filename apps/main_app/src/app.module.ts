import {
  AuthModule,
  RmqModule,
  COUNTRY_SERVICE,
  FILM_SERVICE,
  GENRE_SERVICE,
  STAFF_SERVICE,
  GoogleStrategy,
  SCORE_SERVICE,
  REVIEW_SERVICE,
} from '@app/common';
import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AppAuthController } from './app.auth.controller';
import { AppCountryController } from './app.country.controller';
import { AppFillDbController } from './app.fill-db.controller';
import { AppFilmController } from './app.film.controller';
import { AppGenreController } from './app.genre.controller';
import { AppReviewController } from './app.review.controller';
import { AppScoresController } from './app.scores.controller';
import { AppStaffController } from './app.staff.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        GOOGLE_CLIENT_ID: Joi.string().required(),
        GOOGLE_SECRET: Joi.string().required(),
        VK_CLIENT_ID: Joi.string().required(),
        VK_CALLBACK: Joi.string().required(),
        VK_CLIENT_SECRET: Joi.string().required(),
      }),
      envFilePath: './apps/main_app/.env',
    }),
    RmqModule.register({ name: FILM_SERVICE }),
    RmqModule.register({ name: GENRE_SERVICE }),
    RmqModule.register({ name: STAFF_SERVICE }),
    RmqModule.register({ name: COUNTRY_SERVICE }),
    RmqModule.register({ name: SCORE_SERVICE }),
    RmqModule.register({ name: REVIEW_SERVICE }),
    forwardRef(() => AuthModule),
  ],
  controllers: [
    AppFillDbController,
    AppAuthController,
    AppFilmController,
    AppGenreController,
    AppStaffController,
    AppCountryController,
    AppScoresController,
    AppReviewController,
  ],
  providers: [GoogleStrategy],
})
export class AppModule {}
