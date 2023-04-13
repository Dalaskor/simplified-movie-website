import { DatabaseModule } from '@app/common';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Country } from 'apps/country/src/country.model';
import { Genre } from 'apps/genre/src/genre.model';
import { Staff } from 'apps/staff/src/staff.model';
import { FilmController } from './film.controller';
import { Film } from './film.model';
import { FilmService } from './film.service';

@Module({
    imports: [
        DatabaseModule,
        SequelizeModule.forFeature([Film, Genre, Country, Staff]),
    ],
    controllers: [FilmController],
    providers: [FilmService],
})
export class FilmModule {}
