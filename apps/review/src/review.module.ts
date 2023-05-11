import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import * as Joi from 'joi';
import {
  AUTH_SERVICE,
  DatabaseModule,
  FILM_SERVICE,
  RmqModule,
} from '@app/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Review } from '@app/models';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_REVIEW_QUEUE: Joi.string().required(),
        POSTGRES_URI: Joi.string().required(),
      }),
      envFilePath: './apps/review/.env',
    }),
    DatabaseModule,
    SequelizeModule.forFeature([Review]),
    RmqModule,
    RmqModule.register({ name: FILM_SERVICE }),
    RmqModule.register({ name: AUTH_SERVICE }),
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
