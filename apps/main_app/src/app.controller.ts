import {
    COUNTRY_SERVICE,
    FILM_SERVICE,
    GENRE_SERVICE,
    STAFF_SERVICE,
} from '@app/common';
import { AUTH_SERVICE } from '@app/common/auth/service';
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
import { CreateUserDto } from 'apps/auth/src/users/dto/create-user.dto';
import { CreateCountryDto } from 'apps/country/src/dto/create-country.dto';
import { UpdateCountryDto } from 'apps/country/src/dto/update-country.dto';
import { CreateFilmDto } from 'apps/film/src/dto/create-film.dto';
import { UpdateFilmDto } from 'apps/film/src/dto/update-film.dto';
import { CreateGenreDto } from 'apps/genre/src/dto/create-genre.dto';
import { UpdateGenreDto } from 'apps/genre/src/dto/update-genre.dto';
import { CreateStaffDto } from 'apps/staff/src/dto/create-staff.dto';
import { UpdateStaffDto } from 'apps/staff/src/dto/update-staff.dto';
import { lastValueFrom, tap } from 'rxjs';
import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        @Inject(FILM_SERVICE) private filmClient: ClientProxy,
        @Inject(GENRE_SERVICE) private genreClient: ClientProxy,
        @Inject(STAFF_SERVICE) private staffClient: ClientProxy,
        @Inject(COUNTRY_SERVICE) private countryClient: ClientProxy,
        @Inject(AUTH_SERVICE) private authClient: ClientProxy,
    ) {}

    // Заполнить базу данных из json
    @Post('/fill-db')
    async fillDb(@Body() dtoArray: CreateFilmDto[]) {
        await lastValueFrom(this.filmClient.emit('createManyFilm', dtoArray));

        return { status: HttpStatus.CREATED };
    }

    //Auth endpoints
    @Post('/registration')
    async registration(@Body() dto: CreateUserDto) {
        return this.authClient.send('registration', dto);
    }

    @Post('/login')
    async login(@Body() dto: CreateUserDto) {
        return this.authClient.send('login', dto);
    }

    // Film endpoints
    @Post('/films')
    async createFilm(@Body() dto: CreateFilmDto) {
        return this.filmClient.send('createFilm', dto);
    }

    @Get('/films')
    async getFilms() {
        return this.filmClient.send('findAllFilm', {});
    }

    @Get('/films/:id')
    async getFilmById(@Param('id') id: number) {
        return this.filmClient.send('findOneFilm', id);
    }

    @Put('/film-update')
    async updateFilm(@Body() dto: UpdateFilmDto) {
        return this.filmClient.send('updateFilm', dto);
    }

    @Delete('/films/:id')
    async deleteFilm(@Param('id') id: number) {
        return this.filmClient.send('removeFilm', id);
    }

    // Genre endpoints
    @Post('/genres')
    async createGenre(@Body() dto: CreateGenreDto) {
        return this.genreClient.send('createGenre', dto);
    }

    @Get('/genres')
    async getGenres() {
        return this.genreClient.send('findAllGenre', {});
    }

    @Get('/genres/:id')
    async getOneGenre(@Param('id') id: number) {
        return this.genreClient.send('findOneGenre', id);
    }

    @Put('/genre-update')
    async updateGenre(@Body() dto: UpdateGenreDto) {
        return this.genreClient.send('updateGenre', dto);
    }

    @Delete('/genres/:id')
    async deleteGenre(@Param('id') id: number) {
        return this.genreClient.send('removeGenre', id);
    }

    // Staff endpoints
    @Post('/staffs')
    async createStaff(@Body() dto: CreateStaffDto) {
        return this.staffClient.send('createStaff', dto);
    }

    @Get('/staffs')
    async getStaffs() {
        return this.staffClient.send('findAllStaff', {});
    }

    @Get('/staffs/:id')
    async getOneStaff(@Param('id') id: number) {
        return this.staffClient.send('findOneStaff', id);
    }

    @Put('/staff-update')
    async updateStaff(@Body() dto: UpdateStaffDto) {
        return this.staffClient.send('updateStaff', dto);
    }

    @Delete('/staffs/:id')
    async deleteStaff(@Param('id') id: number) {
        return this.staffClient.send('removeStaff', id);
    }

    // Country endpoints
    @Post('/countries')
    async createCountry(@Body() dto: CreateCountryDto) {
        return this.countryClient.send('createCountry', dto);
    }

    @Get('/countries')
    async getCountry() {
        return this.countryClient.send('findAllCountry', {});
    }

    @Get('/countries/:id')
    async getOneCountry(@Param('id') id: number) {
        return this.countryClient.send('findOneCountry', id);
    }

    @Put('/country-update')
    async updateCountry(@Body() dto: UpdateCountryDto) {
        return this.countryClient.send('updateCountry', dto);
    }

    @Delete('/countries/:id')
    async deleteCountry(@Param('id') id: number) {
        return this.countryClient.send('removeCountry', id);
    }
}
