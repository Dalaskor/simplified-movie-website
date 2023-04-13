import { Inject, Injectable } from '@nestjs/common';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { ClientProxy } from '@nestjs/microservices';
import { CreateStaffDto } from './../../staff/src/dto/create-staff.dto';
import { CreateCountryDto } from './../../country/src/dto/create-country.dto';
import { CreateGenreDto } from './../../genre/src/dto/create-genre.dto';
import {
    COUNTRY_SERVICE,
    GENRE_SERVICE,
    STAFF_SERVICE,
} from '../constants/services';

@Injectable()
export class FilmService {
    constructor(
        @Inject(STAFF_SERVICE) private readonly staffClient: ClientProxy,
        @Inject(COUNTRY_SERVICE) private readonly countryClient: ClientProxy,
        @Inject(GENRE_SERVICE) private readonly genreClient: ClientProxy,
    ) {}

    // использовать один раз
    async createMany(createFilmDtoArray: CreateFilmDto[]) {
        let staffArray: CreateStaffDto[] =
            this.getStaffArray(createFilmDtoArray);
        let countryArray: CreateCountryDto[] =
            this.getCountryArray(createFilmDtoArray);
        let genreArray: CreateGenreDto[] =
            this.getGenreArray(createFilmDtoArray);

        this.staffClient.send('createManyStaff', staffArray);
        this.countryClient.send('createManyCountry', countryArray);
        this.genreClient.send('createManyGenre', genreArray);

        /*
    дождаться завершения клиентов и добавить код по добавлению фильма со всеми отношениями
    */

        return createFilmDtoArray;
    }

    //не готова
    async create(createFilmDto: CreateFilmDto) {
        let staffArray: CreateStaffDto[] = this.getStaffArray([createFilmDto]);
        this.staffClient.send('createManyStaff', staffArray);

        return createFilmDto;
    }

    async findAll() {
        return;
    }

    async findOne(id: number) {
        return id;
    }

    async update(id: number, updateFilmDto: UpdateFilmDto) {
        return { id, ...updateFilmDto };
    }

    async remove(id: number) {
        return id;
    }

    getStaffArray(createFilmDtoArray: CreateFilmDto[]): CreateStaffDto[] {
        let staffArray: CreateStaffDto[] = [];

        createFilmDtoArray.forEach((value) => {
            value.director.forEach((name) => {
                if (!staffArray.find((value) => value.name == name))
                    staffArray.push({ name });
            });
            value.scenario.forEach((name) => {
                if (!staffArray.find((value) => value.name == name))
                    staffArray.push({ name });
            });
            value.producer.forEach((name) => {
                if (!staffArray.find((value) => value.name == name))
                    staffArray.push({ name });
            });
            value.operator.forEach((name) => {
                if (!staffArray.find((value) => value.name == name))
                    staffArray.push({ name });
            });
            value.compositor.forEach((name) => {
                if (!staffArray.find((value) => value.name == name))
                    staffArray.push({ name });
            });
            value.artist.forEach((name) => {
                if (!staffArray.find((value) => value.name == name))
                    staffArray.push({ name });
            });
            value.montage.forEach((name) => {
                if (!staffArray.find((value) => value.name == name))
                    staffArray.push({ name });
            });
            value.actors.forEach((name) => {
                if (!staffArray.find((value) => value.name == name))
                    staffArray.push({ name });
            });
        });

        return staffArray;
    }

    getCountryArray(createFilmDtoArray: CreateFilmDto[]): CreateCountryDto[] {
        let countryArray: CreateCountryDto[] = [];

        createFilmDtoArray.forEach((value) => {
            value.country.forEach((name) => {
                if (!countryArray.find((value) => value.name == name))
                    countryArray.push({ name });
            });
            value.spectators.forEach((obj) => {
                if (!countryArray.find((value) => value.name == obj.country))
                    countryArray.push({ name: obj.country });
            });
        });

        return countryArray;
    }

    getGenreArray(createFilmDtoArray: CreateFilmDto[]): CreateGenreDto[] {
        let genreArray: CreateGenreDto[] = [];

        createFilmDtoArray.forEach((value) => {
            value.genre.forEach((name) => {
                if (!genreArray.find((value) => value.name == name))
                    genreArray.push({ name });
            });
        });

        return genreArray;
    }
}
