import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { ClientProxy } from '@nestjs/microservices';
import { CreateStaffDto } from './../../staff/src/dto/create-staff.dto';
import { CreateCountryDto } from './../../country/src/dto/create-country.dto';
import { CreateGenreDto } from './../../genre/src/dto/create-genre.dto';
import { lastValueFrom, tap } from 'rxjs';
import { InjectModel } from '@nestjs/sequelize';
import { Film } from './film.model';
import { COUNTRY_SERVICE, GENRE_SERVICE, STAFF_SERVICE } from '@app/common';

@Injectable()
export class FilmService {
    constructor(
        @Inject(STAFF_SERVICE) private readonly staffClient: ClientProxy,
        @Inject(COUNTRY_SERVICE) private readonly countryClient: ClientProxy,
        @Inject(GENRE_SERVICE) private readonly genreClient: ClientProxy,
        @InjectModel(Film) private readonly filmRepository: typeof Film,
    ) {}

    // использовать один раз
    async createMany(createFilmDtoArray: CreateFilmDto[]) {
        let staffArray: CreateStaffDto[] =
            this.getStaffArray(createFilmDtoArray);
        let countryArray: CreateCountryDto[] =
            this.getCountryArray(createFilmDtoArray);
        let genreArray: CreateGenreDto[] =
            this.getGenreArray(createFilmDtoArray);

        await lastValueFrom(
            this.staffClient.send('createManyStaff', staffArray),
        );

        await lastValueFrom(
            this.countryClient.send('createManyCountry', countryArray),
        );

        await lastValueFrom(
            this.genreClient.send('createManyGenre', genreArray),
        );

        // const staffs = this.staffClient.send('createManyStaff', staffArray);
        // const genres = this.genreClient.send('createManyGenre', genreArray);
        // const countries = this.countryClient.send(
        // 'createManyCountry',
        // countryArray,
        // );

        const filmDtos = [];
        for (const dto of createFilmDtoArray) {
            filmDtos.push({
                name: dto.name,
                name_en: dto.name_en,
                mainImg: dto.mainImg,
                year: dto.year,
                tagline: dto.tagline,
                budget: dto.budget,
                fees: dto.fees,
                feesRU: dto.feesRU,
                feesUS: dto.feesUS,
                premiere: dto.premiere,
                premiereRU: dto.premiereRU,
                releaseDVD: dto.releaseDVD,
                releaseBluRay: dto.releaseBluRay,
                age: dto.age,
                ratingMPAA: dto.ratingMPAA,
            });
        }

        const films = await this.filmRepository.bulkCreate(filmDtos);

        for (const film of films) {
            const operators = await lastValueFrom(
                this.staffClient.send('getStaffByNames', film.operators),
            );

            const compositors = await lastValueFrom(
                this.staffClient.send('getStaffByNames', film.compositors),
            );

            const actors = await lastValueFrom(
                this.staffClient.send('getStaffByNames', film.actors),
            );

            const artists = await lastValueFrom(
                this.staffClient.send('getStaffByNames', film.artists),
            );

            const directors = await lastValueFrom(
                this.staffClient.send('getStaffByNames', film.directors),
            );

            const montages = await lastValueFrom(
                this.staffClient.send('getStaffByNames', film.montages),
            );

            const genres = await lastValueFrom(
                this.genreClient.send('getGenresByNames', film.genres),
            );

            const countries = await lastValueFrom(
                this.countryClient.send('getCountriesByNames', film.genres),
            );

            film.$set('genres', genres);
            film.genres = genres;
            film.$set('countries', countries);
            film.countries = countries;
            film.$set('operators', operators);
            film.operators = operators;
            film.$set('compositors', compositors);
            film.compositors = compositors;
            film.$set('actors', actors);
            film.actors = actors;
            film.$set('artists', artists);
            film.artists = artists;
            film.$set('directors', directors);
            film.directors = directors;
            film.$set('montages', montages);
            film.montages = montages;
        }

        return createFilmDtoArray;
    }

    //не готова
    async create(createFilmDto: CreateFilmDto) {
        let staffArray: CreateStaffDto[] = this.getStaffArray([createFilmDto]);
        this.staffClient.send('createManyStaff', staffArray);

        return createFilmDto;
    }

    async findAll() {
        const films = await this.filmRepository.findAll({
            include: { all: true },
        });

        return films;
    }

    async findOne(id: number) {
        const film = await this.filmRepository.findOne({ where: { id } });

        if (!film) {
            throw new HttpException('Фильм не найден', HttpStatus.NOT_FOUND);
        }

        return film;
    }

    async update(id: number, updateFilmDto: UpdateFilmDto) {
        return { id, ...updateFilmDto };
    }

    async remove(id: number) {
        const film = await this.findOne(id);

        film.destroy();

        return { status: HttpStatus.OK, value: 'Фильм удален' };
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
