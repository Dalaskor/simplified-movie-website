import {
    HttpStatus,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { InjectModel } from '@nestjs/sequelize';
import {
    COUNTRY_SERVICE,
    GENRE_SERVICE,
    Order,
    STAFF_SERVICE,
} from '@app/common';
import { Op } from 'sequelize';
import {
    Country,
    CreateCountryDto,
    CreateFilmDto,
    CreateGenreDto,
    CreateSpectatorDto,
    CreateStaffDto,
    Film,
    FilmPagFilterDto,
    Genre,
    Spectators,
    Staff,
    UpdateFilmDto,
} from '@app/models';

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

        const staffModelArr = await lastValueFrom(
            this.staffClient.send('createManyStaff', staffArray),
        );

        const countriesModelArr = await lastValueFrom(
            this.countryClient.send('createManyCountry', countryArray),
        );

        const genresModelArr = await lastValueFrom(
            this.genreClient.send('createManyGenre', genreArray),
        );

        const filmDtos = this.validateDtos(createFilmDtoArray);
        const films = await this.filmRepository.bulkCreate(filmDtos, {
            ignoreDuplicates: true,
        });

        for (const dto of filmDtos) {
            const curFilm = films.find((film) => {
                return film.name === dto.name;
            });

            if (!curFilm) {
                continue;
            }

            const genresId = this.getIdsFromModelArr(
                dto.genres,
                genresModelArr,
            );
            await curFilm.$set('genres', genresId);

            const countriesId = this.getIdsFromModelArr(
                dto.countries,
                countriesModelArr,
            );
            await curFilm.$set('countries', countriesId);

            const scenariosId = this.getIdsFromModelArr(
                dto.scenario,
                staffModelArr,
            );
            await curFilm.$set('scenario', scenariosId);

            const compositorId = this.getIdsFromModelArr(
                dto.compositors,
                staffModelArr,
            );
            await curFilm.$set('compositors', compositorId);

            const actorsId = this.getIdsFromModelArr(dto.actors, staffModelArr);
            await curFilm.$set('actors', actorsId);

            const artistsId = this.getIdsFromModelArr(
                dto.artists,
                staffModelArr,
            );
            await curFilm.$set('artists', artistsId);

            const directorsId = this.getIdsFromModelArr(
                dto.directors,
                staffModelArr,
            );
            await curFilm.$set('directors', directorsId);

            const montageId = this.getIdsFromModelArr(
                dto.montages,
                staffModelArr,
            );
            await curFilm.$set('montages', montageId);

            const operarotsId = this.getIdsFromModelArr(
                dto.operators,
                staffModelArr,
            );
            await curFilm.$set('operators', operarotsId);

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

        return { status: 'Created' };
    }

    getIdsFromModelArr(names: string[], fromArr: any[]) {
        return fromArr.map((item) => {
            if (names.includes(item.name)) {
                return item.id;
            }
        });
    }

    /*
     * Сервис для создание зрителя
     */
    async createSpectator(spectator: CreateSpectatorDto): Promise<Spectators> {
        const country = await this.getCountryByName(spectator.country);

        if (!country) {
            throw new RpcException(new NotFoundException('Страна не найдена'));
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

    /*
     * Сервис для для создания одного фильма
     */
    async create(dto: CreateFilmDto): Promise<Film> {
        const film = await this.filmRepository.create({
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

        const genres = await this.getGenresByNames(dto.genre);
        await this.filmApplyGenres(film, genres);

        const countries = await this.getCountriesByNames(dto.country);
        await this.filmApplyCountries(film, countries);

        const scenarios = await this.getStaffsByNames(dto.scenario);
        await this.filmApplyScenarios(film, scenarios);

        const compositors = await this.getStaffsByNames(dto.compositor);
        await this.filmApplyCompositors(film, compositors);

        const actors = await this.getStaffsByNames(dto.actors);
        await this.filmApplyActors(film, actors);

        const artists = await this.getStaffsByNames(dto.artist);
        await this.filmApplyArtists(film, artists);

        const directors = await this.getStaffsByNames(dto.director);
        await this.filmApplyDirectors(film, directors);

        const montages = await this.getStaffsByNames(dto.montage);
        await this.filmApplyMontages(film, montages);

        const operators = await this.getStaffsByNames(dto.operator);
        await this.filmApplyOperators(film, operators);

        return film;
    }

    /*
     * Получить все фильмы из бд
     */
    async findAll(): Promise<Film[]> {
        const films = await this.filmRepository.findAll({
            include: { all: true },
        });

        return films;
    }

    /*
     * Получить фильм по id из бд
     */
    async findOne(id: number): Promise<Film> {
        const film = await this.filmRepository.findOne({
            where: { id },
            include: { all: true },
        });

        if (!film) {
            throw new RpcException(new NotFoundException('Фильм не найден'));
        }

        return film;
    }

    /*
     * Обновить данные о фильме
     */
    async update(id: number, dto: UpdateFilmDto): Promise<Film> {
        const film = await this.filmRepository.findOne({ where: { id } });

        if (!film) {
            throw new RpcException(new NotFoundException('Фильм не найден'));
        }

        dto.name ? (film.name = dto.name) : '';
        dto.name_en ? (film.name_en = dto.name_en) : '';
        dto.mainImg ? (film.mainImg = dto.mainImg) : '';
        dto.year ? (film.year = Number(dto.year)) : '';
        dto.tagline ? (film.tagline = dto.tagline) : '';
        dto.budget ? (film.budget = dto.budget) : '';
        dto.fees ? (film.fees = dto.fees) : '';
        dto.feesRU ? (film.feesRU = dto.feesRU) : '';
        dto.feesUS ? (film.feesUS = dto.feesUS) : '';
        dto.premiere ? (film.premiere = dto.premiere) : '';
        dto.premiereRU ? (film.premiereRU = dto.premiereRU) : '';
        dto.releaseDVD ? (film.releaseDVD = dto.releaseDVD) : '';
        dto.releaseBluRay ? (film.releaseBluRay = dto.releaseBluRay) : '';
        dto.age ? (film.age = dto.age) : '';
        dto.ratingMPAA ? (film.ratingMPAA = dto.ratingMPAA) : '';
        dto.description ? (film.description = dto.description) : '';
        dto.type ? (film.type = dto.type) : '';

        if (dto.genre) {
            const genres = await this.getGenresByNames(dto.genre);
            await this.filmApplyGenres(film, genres);
        }

        if (dto.country) {
            const countries = await this.getCountriesByNames(dto.country);
            await this.filmApplyCountries(film, countries);
        }

        if (dto.scenario) {
            const scenarios = await this.getStaffsByNames(dto.scenario);
            await this.filmApplyScenarios(film, scenarios);
        }

        if (dto.compositor) {
            const compositors = await this.getStaffsByNames(dto.compositor);
            await this.filmApplyCompositors(film, compositors);
        }

        if (dto.actors) {
            const actors = await this.getStaffsByNames(dto.actors);
            await this.filmApplyActors(film, actors);
        }

        if (dto.artist) {
            const artists = await this.getStaffsByNames(dto.artist);
            await this.filmApplyArtists(film, artists);
        }

        if (dto.director) {
            const directors = await this.getStaffsByNames(dto.director);
            await this.filmApplyDirectors(film, directors);
        }

        if (dto.montage) {
            const montages = await this.getStaffsByNames(dto.montage);
            await this.filmApplyMontages(film, montages);
        }

        if (dto.operator) {
            const operators = await this.getStaffsByNames(dto.operator);
            await this.filmApplyOperators(film, operators);
        }

        return film;
    }

    /*
     * Удалить фильм из бд
     */
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

    validateDtos(dtoArray: CreateFilmDto[]) {
        const filmDtos = [];

        for (const dto of dtoArray) {
            const filmDto = {
                name: dto.name,
                name_en: dto.name_en,
                type: dto.type,
                mainImg: dto.mainImg,
                year: dto.year,
                tagline: dto.tagline,
                budget: dto.budget,
                feesUS: dto.feesUS,
                feesRU: dto.feesRU,
                fees: dto.fees,
                premiere: dto.premiere,
                premiereRU: dto.premiereRU,
                releaseDVD: dto.releaseDVD,
                releaseBluRay: dto.releaseBluRay,
                age: dto.age,
                ratingMPAA: dto.ratingMPAA,
                time: dto.time,
                description: dto.description,
                genres: [],
                countries: [],
                operators: [],
                compositors: [],
                actors: [],
                artists: [],
                directors: [],
                montages: [],
                scenario: [],
                // spectators: [],
            };

            for (const genre of dto.genre) {
                filmDto.genres.push(genre);
            }

            for (const country of dto.country) {
                filmDto.countries.push(country);
            }

            for (const operator of dto.operator) {
                filmDto.operators.push(operator);
            }

            for (const compositor of dto.compositor) {
                filmDto.compositors.push(compositor);
            }

            for (const actor of dto.actors) {
                filmDto.actors.push(actor);
            }

            for (const artist of dto.artist) {
                filmDto.artists.push(artist);
            }

            for (const director of dto.director) {
                filmDto.directors.push(director);
            }

            for (const montage of dto.montage) {
                filmDto.montages.push(montage);
            }

            for (const scenario of dto.scenario) {
                filmDto.scenario.push(scenario);
            }

            filmDtos.push(filmDto);
        }

        return filmDtos;
    }

    /*
     * Сервис для получения массива жанров по массиву названий
     */
    async getGenresByNames(names: string[]): Promise<Genre[]> {
        return await lastValueFrom(
            this.genreClient.send<Genre[]>({ cmd: 'getGenresByNames' }, names),
        );
    }

    /*
     * Сервис для получения массива стран по массиву названий
     */
    async getCountriesByNames(names: string[]): Promise<Country[]> {
        return await lastValueFrom(
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
        return await lastValueFrom(
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
     * Сервис для получения списка фильмов с пагинацией
     */
    async getFilmWithPag(pageOptionsDto: FilmPagFilterDto) {
        const order: string = pageOptionsDto.order
            ? pageOptionsDto.order
            : Order.ASC;
        const page: number = pageOptionsDto.page ? pageOptionsDto.page : 1;
        const take: number = pageOptionsDto.take ? pageOptionsDto.take : 10;
        const skip = (page - 1) * take;

        let genreFilter: string[] = pageOptionsDto.genres
            ? pageOptionsDto.genres
            : [];
        let genreEnFilter: string[] = pageOptionsDto.genres_en
            ? pageOptionsDto.genres_en
            : [];
        let countryFilter: string[] = pageOptionsDto.countries
            ? pageOptionsDto.countries
            : [];
        let actorFilter: string[] = pageOptionsDto.actors
            ? pageOptionsDto.actors
            : [];
        let directorFilter: string[] = pageOptionsDto.directors
            ? pageOptionsDto.directors
            : [];

        if (!Array.isArray(genreFilter)) {
            genreFilter = [genreFilter];
        }

        if (!Array.isArray(genreEnFilter)) {
            genreEnFilter = [genreEnFilter];
        }

        if (!Array.isArray(countryFilter)) {
            countryFilter = [countryFilter];
        }

        if (!Array.isArray(actorFilter)) {
            actorFilter = [actorFilter];
        }

        if (!Array.isArray(directorFilter)) {
            directorFilter = [directorFilter];
        }

        const films = await this.filmRepository.findAll({
            include: [
                {
                    model: Genre,
                    where: {
                        name: {
                            [Op.or]: genreFilter,
                        },
                        name_en: {
                            [Op.or]: genreEnFilter,
                        },
                    },
                },
                {
                    model: Country,
                    where: {
                        name: {
                            [Op.or]: countryFilter,
                        },
                    },
                },
                {
                    model: Staff,
                    as: 'actors',
                    where: {
                        name: {
                            [Op.or]: actorFilter,
                        },
                    },
                },
                {
                    model: Staff,
                    as: 'directors',
                    where: {
                        name: {
                            [Op.or]: directorFilter,
                        },
                    },
                },
                {
                    all: true,
                },
            ],
            order: [['createdAt', order]],
            offset: skip,
            limit: take,
        });

        return films;
    }

    async incFilmRating(film_id: number, count: number, value: number) {
        const film = await this.filmRepository.findOne({
            where: { id: film_id },
        });

        if (!film) {
            throw new RpcException(new NotFoundException('Фильм не найден'));
        }

        const newAvgScore = this.incRating(count, film.scoreAVG, value);

        film.scoreAVG = newAvgScore;
        await film.save();

        return { statusCode: HttpStatus.OK };
    }

    async decFilmRating(film_id: number, count: number, value: number) {
        const film = await this.filmRepository.findOne({
            where: { id: film_id },
        });

        if (!film) {
            throw new RpcException(new NotFoundException('Фильм не найден'));
        }

        const newAvgScore = this.decRating(count, film.scoreAVG, value);

        film.scoreAVG = newAvgScore;
        await film.save();

        return { statusCode: HttpStatus.OK };
    }

    async updateFilmRating(
        film_id: number,
        count: number,
        old_value: number,
        new_value: number,
    ) {
        const film = await this.filmRepository.findOne({
            where: { id: film_id },
        });

        if (!film) {
            throw new RpcException(new NotFoundException('Фильм не найден'));
        }

        const newAvgScore = this.updateRating(
            count,
            film.scoreAVG,
            old_value,
            new_value,
        );

        film.scoreAVG = newAvgScore;
        await film.save();

        return { statusCode: HttpStatus.OK };
    }

    private incRating(count: number, currentRating: number, value: number) {
        let newScoreAvg = currentRating ? currentRating : 0;

        newScoreAvg *= count;
        newScoreAvg += value;
        count++;
        newScoreAvg /= count;

        return newScoreAvg;
    }

    private decRating(count: number, currentRating: number, value: number) {
        let newScoreAvg = currentRating;

        newScoreAvg *= count;
        newScoreAvg -= value;
        count--;

        if (count != 0) {
            newScoreAvg /= count;
        } else {
            newScoreAvg = 0;
        }

        return newScoreAvg;
    }

    private updateRating(
        count: number,
        currentRating: number,
        oldValue: number,
        newValue: number,
    ) {
        let newScoreAvg = currentRating;

        newScoreAvg *= count;
        newScoreAvg -= oldValue;
        newScoreAvg += newValue;
        newScoreAvg /= count;

        return newScoreAvg;
    }
}
