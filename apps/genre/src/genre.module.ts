import { DatabaseModule, RmqModule } from '@app/common';
import { Genre } from '@app/models';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import * as Joi from 'joi';
import { GenreController } from './genre.controller';
import { GenreService } from './genre.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_GENRE_QUEUE: Joi.string().required(),
        POSTGRES_URI: Joi.string().required(),
      }),
      envFilePath: './apps/genre/.env',
    }),
    DatabaseModule,
    SequelizeModule.forFeature([Genre]),
    RmqModule,
  ],
  controllers: [GenreController],
  providers: [GenreService],
})
export class GenreModule {}
