import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
    imports: [
        SequelizeModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                uri: configService.get<string>('POSTGRES_URI'),
                dialect: 'postgres',
                models: [],
                autoLoadModels: true,
            }),
            inject: [ConfigService],
        }),
    ],
})
export class DatabaseModule {}
