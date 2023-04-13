import { DatabaseModule } from '@app/common';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CountryController } from './country.controller';
import { Country } from './country.model';
import { CountryService } from './country.service';

@Module({
    imports: [DatabaseModule, SequelizeModule.forFeature([Country])],
    controllers: [CountryController],
    providers: [CountryService],
})
export class CountryModule {}
