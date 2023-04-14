import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Inject,
    Param,
    Post,
    Put,
} from '@nestjs/common';
import { ClientProxy, Payload } from '@nestjs/microservices';
import { CreateFilmDto } from 'apps/film/src/dto/create-film.dto';
import { UpdateFilmDto } from 'apps/film/src/dto/update-film.dto';
import { lastValueFrom } from 'rxjs';
import { FILM_SERVICE } from '../constants/services';
import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        @Inject(FILM_SERVICE) private readonly filmClient: ClientProxy,
    ) {}

    @Post('/fill-db')
    async fillDb(@Body() dtoArray: CreateFilmDto[]) {
        await lastValueFrom(this.filmClient.send('createManyFilm', dtoArray));

        return HttpStatus.CREATED;
    }

    @Get('/films')
    async getFilms() {
        return await lastValueFrom(this.filmClient.send('findAllFilm', {}));
    }

    @Get('/films/:id')
    async getFilmById(@Param('id') id: number) {
        return await lastValueFrom(this.filmClient.send('findOneFilm', id));
    }

    @Put('/film-update')
    async updateFilm(@Body() dto: UpdateFilmDto) {
        return await lastValueFrom(this.filmClient.send('updateFilm', dto));
    }

    @Delete('/films/:id')
    async deleteFilm(@Param('id') id: number) {
        return await lastValueFrom(this.filmClient.send('removeFilm', id))
    }
}
