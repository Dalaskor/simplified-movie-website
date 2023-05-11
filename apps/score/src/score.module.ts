import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScoreController } from './score.controller';
import { ScoreService } from './score.service';
import * as Joi from 'joi';
import { DatabaseModule, FILM_SERVICE, RmqModule } from '@app/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Score } from '@app/models';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_SCORE_QUEUE: Joi.string().required(),
        POSTGRES_URI: Joi.string().required(),
      }),
      envFilePath: './apps/score/.env',
    }),
    RmqModule,
    RmqModule.register({ name: FILM_SERVICE }),
    DatabaseModule,
    SequelizeModule.forFeature([Score]),
  ],
  controllers: [ScoreController],
  providers: [ScoreService],
})
export class ScoreModule {}
