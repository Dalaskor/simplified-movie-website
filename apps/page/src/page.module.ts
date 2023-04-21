import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PageController } from './page.controller';
import { PageService } from './page.service';
import * as Joi from 'joi';
import { DatabaseModule, RmqModule } from '@app/common';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: Joi.object({
                RABBIT_MQ_URI: Joi.string().required(),
                RABBIT_MQ_PAGE_QUEUE: Joi.string().required(),
                POSTGRES_URI: Joi.string().required(),
            }),
            envFilePath: './apps/film/.env',
        }),
        DatabaseModule,
        RmqModule,
    ],
    controllers: [PageController],
    providers: [PageService],
})
export class PageModule {}
