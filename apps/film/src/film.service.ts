import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { ClientProxy } from '@nestjs/microservices';
import { CreateStaffDto } from './../../staff/src/dto/create-staff.dto';
import { CreateCountryDto } from './../../country/src/dto/create-country.dto';
import { CreateGenreDto } from './../../genre/src/dto/create-genre.dto';
import { lastValueFrom } from 'rxjs';
import { InjectModel } from '@nestjs/sequelize';
import { Film } from './film.model';
import { COUNTRY_SERVICE, GENRE_SERVICE, STAFF_SERVICE } from '@app/common';
import { Spectators } from './film-spectator.model';
import { Genre } from 'apps/genre/src/genre.model';
import { Country } from 'apps/country/src/country.model';
import { Staff } from 'apps/staff/src/staff.model';
import { CreateSpectatorDto } from './dto/create-spectator.dto';

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

    /*
     * Сервис для заполнения бд из файла json
     */
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

            const genres = await this.getGenresByNames(dto.genre);
            await this.filmApplyGenres(curFilm, genres);

            const countries = await this.getCountriesByNames(dto.country);
            await this.filmApplyCountries(curFilm, countries);

            const scenarios = await this.getStaffsByNames(dto.scenario);
            await this.filmApplyScenarios(curFilm, scenarios);

            const compositors = await this.getStaffsByNames(dto.compositor);
            await this.filmApplyCompositors(curFilm, compositors);

            const actors = await this.getStaffsByNames(dto.actors);
            await this.filmApplyActors(curFilm, actors);

            const artists = await this.getStaffsByNames(dto.artist);
            await this.filmApplyArtists(curFilm, artists);

            const directors = await this.getStaffsByNames(dto.director);
            await this.filmApplyDirectors(curFilm, directors);

            const montages = await this.getStaffsByNames(dto.montage);
            await this.filmApplyMontages(curFilm, montages);

            const operators = await this.getStaffsByNames(dto.operator);
            await this.filmApplyOperators(curFilm, operators);

            /* const spectatorIds = [];
            for (const spectator of dto.spectators) {
                const createdSpectator = await this.createSpectator(spectator);
                if(!createdSpectator) {
                    continue;
                }
                spectatorIds.push(createdSpectator.id);
            }
            await curFilm.$set('spectators', spectatorIds); */
        }

        return createFilmDtoArray;
    }

    /*
     * Сервис для получения массива жанров по массиву названий
     */
    async getGenresByNames(names: string[]): Promise<Genre[]> {
        return lastValueFrom(
            this.genreClient.send<Genre[]>({ cmd: 'getGenresByNames' }, names),
        );
    }

    /*
     * Сервис для получения массива стран по массиву названий
     */
    async getCountriesByNames(names: string[]): Promise<Country[]> {
        return lastValueFrom(
            this.countryClient.send<Country[]>(
                { cmd: 'getCountriesByNames' },
                names,
            ),
        );
    }

    /*
     * Сервис для получения массива участников фильма по массиву названий
     */
    async getStaffsByNames(names: string[]): Promise<Staff[]> {
        return lastValueFrom(
            this.staffClient.send<Staff[]>({ cmd: 'getStaffByNames' }, names),
        );
    }

    /*
     * Сервис для присвоения жанров фильму
     */
    async filmApplyGenres(film: Film, genres: Genre[]) {
        const ids = genres.map((item) => item.id);
        await film.$set('genres', ids);
    }

    /*
     * Сервис для присвоения стран фильму
     */
    async filmApplyCountries(film: Film, countries: Country[]) {
        const ids = countries.map((item) => item.id);
        await film.$set('countries', ids);
    }

    /*
     * Сервис для присвоения сценаристов фильму
     */
    async filmApplyScenarios(film: Film, scenarios: Staff[]) {
        const ids = scenarios.map((item) => item.id);
        await film.$set('scenario', ids);
    }

    /*
     * Сервис для присвоения композиторов фильму
     */
    async filmApplyCompositors(film: Film, compositors: Staff[]) {
        const ids = compositors.map((item) => item.id);
        await film.$set('compositors', ids);
    }

    /*
     * Сервис для присвоения актеров фильму
     */
    async filmApplyActors(film: Film, actors: Staff[]) {
        const ids = actors.map((item) => item.id);
        await film.$set('actors', ids);
    }

    /*
     * Сервис для присвоения художников фильму
     */
    async filmApplyArtists(film: Film, artists: Staff[]) {
        const ids = artists.map((item) => item.id);
        await film.$set('artists', ids);
    }

    /*
     * Сервис для присвоения директоров фильму
     */
    async filmApplyDirectors(film: Film, directors: Staff[]) {
        const ids = directors.map((item) => item.id);
        await film.$set('directors', ids);
    }

    /*
     * Сервис для присвоения монтажа фильму
     */
    async filmApplyMontages(film: Film, montages: Staff[]) {
        const ids = montages.map((item) => item.id);
        await film.$set('montages', ids);
    }

    /*
     * Сервис для присвоения операторов фильму
     */
    async filmApplyOperators(film: Film, operators: Staff[]) {
        const ids = operators.map((item) => item.id);
        await film.$set('operators', ids);
    }

    /*
     * Сервис для создание зрителя
     */
    async createSpectator(spectator: CreateSpectatorDto): Promise<Spectators> {
        const country = await this.getCountryByName(spectator.country);

        if (!country) {
            throw new HttpException('Страна не найдена', HttpStatus.NOT_FOUND);
        }

        const newSpectator = await this.spectatorsRepository.create({
            count: spectator.count,
        });

        newSpectator.$set('country', country);

        return newSpectator;
    }

    /*
     * Сервис для получения страны по названию
     */
    async getCountryByName(name: string): Promise<Country> {
        return lastValueFrom(
            this.countryClient.send<Country>(
                { cmd: 'findOneByNameCountry' },
                name,
            ),
        );
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
