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
import { Spectators } from './film-spectator.model';
import { Country } from 'apps/country/src/country.model';

interface spectatorAttrs {
    country: string;
    count: string;
}

@Injectable()
export class FilmService {
    constructor(
        @Inject(STAFF_SERVICE) private staffClient: ClientProxy,
        @Inject(COUNTRY_SERVICE) private countryClient: ClientProxy,
        @Inject(GENRE_SERVICE) private genreClient: ClientProxy,
        @InjectModel(Film) private filmRepository: typeof Film,
        @InjectModel(Spectators)
        private spectatorsRepository: typeof Spectators,
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
                description: dto.description,
                type: dto.type,
                time: dto.time,
            });
        }

        const films = await this.filmRepository.bulkCreate(filmDtos);

        for (const dto of createFilmDtoArray) {
            const curFilm = films.find((film) => {
                return film.name === dto.name;
            });

            if (!curFilm) {
                continue;
            }

            const scenario = await lastValueFrom(
                this.staffClient.send('getStaffByNames', dto.scenario),
            );
            await curFilm.$set('scenario', scenario);
            curFilm.scenario = scenario;

            const compositors = await lastValueFrom(
                this.staffClient.send('getStaffByNames', dto.compositor),
            );
            await curFilm.$set('compositors', compositors);
            curFilm.compositors = compositors;

            const actors = await lastValueFrom(
                this.staffClient.send('getStaffByNames', dto.actors),
            );
            await curFilm.$set('actors', actors);
            curFilm.actors = actors;

            const artists = await lastValueFrom(
                this.staffClient.send('getStaffByNames', dto.artist),
            );
            await curFilm.$set('artists', artists);
            curFilm.artists = artists;

            const directors = await lastValueFrom(
                this.staffClient.send('getStaffByNames', dto.director),
            );
            await curFilm.$set('directors', directors);
            curFilm.directors = directors;

            const montages = await lastValueFrom(
                this.staffClient.send('getStaffByNames', dto.montage),
            );
            await curFilm.$set('montages', montages);
            curFilm.montages = montages;

            const countries = await lastValueFrom(
                this.countryClient.send('getCountriesByNames', dto.country),
            );
            await curFilm.$set('countries', countries);
            curFilm.countries = countries;

            const genres = await this.getGenresByNames(dto.genre);
            await curFilm.$set('genres', genres);
            curFilm.genres = genres;

            for (const spectator of dto.spectators) {
                const createdSpectator = await this.createSpectator(spectator);

                await curFilm.$set('spectators', createdSpectator);
                curFilm.spectators = [createdSpectator];
            }
        }

        return createFilmDtoArray;
    }

    async getGenresByNames(names: string[]) {
        const genres = await this.genreClient.send('getGenresByNames', names);
        return genres;
    }

    async createSpectator(spectator: spectatorAttrs) {
        let country = await lastValueFrom(
            this.countryClient.send('findOneByNameCountry', spectator.country),
        );

        const newSpectator = await this.spectatorsRepository.create({
            count: spectator.count,
        });

        newSpectator.$set('country', country);
        newSpectator.country = country;

        return newSpectator;
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
