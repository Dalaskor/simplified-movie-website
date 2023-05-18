import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { InjectModel } from '@nestjs/sequelize';
import {
  COUNTRY_SERVICE,
  FilmPagResult,
  GENRE_SERVICE,
  Order,
  REVIEW_SERVICE,
  SCORE_SERVICE,
  SORT_PARAMS,
  STAFF_SERVICE,
  STAFF_TYPES,
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
    @Inject(SCORE_SERVICE) private scoreClient: ClientProxy,
    @Inject(REVIEW_SERVICE) private reviewClient: ClientProxy,
    @InjectModel(Film) private filmRepository: typeof Film,
    @InjectModel(Spectators)
    private spectatorsRepository: typeof Spectators,
  ) {}

  async createMany(createFilmDtoArray: CreateFilmDto[]): Promise<any> {
    if (!createFilmDtoArray) {
      throw new RpcException(new BadRequestException('Ошибка заполнения'));
    }

    const step = 50;
    let i = 0;

    while (i < createFilmDtoArray.length) {
      await this.createManyFilms(createFilmDtoArray.slice(i, i + step));
      i += step;
    }

    return { status: 'Created' };
  }

  /**
   * Создать массив фильмов при заполнении бд.
   * @param {CreateFilmDto[]} createFilmDtoArray - DTO для создания массива фльмов.
   * @returns Результат выполнения функции.
   */
  async createManyFilms(createFilmDtoArray: CreateFilmDto[]): Promise<any> {
    if (!createFilmDtoArray) {
      throw new RpcException(new BadRequestException('Ошибка заполнения'));
    }

    if (createFilmDtoArray.length > 50) {
      throw new RpcException(
        new BadRequestException(
          'Превышает лимит размера массива (Лимит равен 50)',
        ),
      );
    }

    let staffArray: CreateStaffDto[] = this.getStaffArray(createFilmDtoArray);
    let countryArray: CreateCountryDto[] =
      this.getCountryArray(createFilmDtoArray);
    let genreArray: CreateGenreDto[] = this.getGenreArray(createFilmDtoArray);

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

      const genresId = this.getIdsFromModelArr(dto.genres, genresModelArr);
      const genres = this.getFilmModelsFromModelArr(dto.genres, genresModelArr);
      await curFilm.$set('genres', genresId);
      curFilm.genres = genres;

      const countriesId = this.getIdsFromModelArr(
        dto.countries,
        countriesModelArr,
      );
      const countries = this.getFilmModelsFromModelArr(
        dto.countries,
        genresModelArr,
      );
      await curFilm.$set('countries', countriesId);
      curFilm.countries = countries;

      const scenariosId = this.getIdsFromModelArr(dto.scenario, staffModelArr);
      const scenarios = this.getFilmModelsFromModelArr(
        dto.scenario,
        staffModelArr,
      );
      await curFilm.$set('scenario', scenariosId);
      curFilm.scenario = scenarios;

      const compositorId = this.getIdsFromModelArr(
        dto.compositors,
        staffModelArr,
      );
      const compositors = this.getFilmModelsFromModelArr(
        dto.compositors,
        staffModelArr,
      );
      await curFilm.$set('compositors', compositorId);
      curFilm.compositors = compositors;

      const actorsId = this.getIdsFromModelArr(dto.actors, staffModelArr);
      const actors = this.getFilmModelsFromModelArr(dto.actors, staffModelArr);
      await curFilm.$set('actors', actorsId);
      curFilm.actors = actors;

      const artistsId = this.getIdsFromModelArr(dto.artists, staffModelArr);
      const artists = this.getFilmModelsFromModelArr(
        dto.artists,
        staffModelArr,
      );
      await curFilm.$set('artists', artistsId);
      curFilm.artists = artists;

      const directorsId = this.getIdsFromModelArr(dto.directors, staffModelArr);
      const directors = this.getFilmModelsFromModelArr(
        dto.directors,
        staffModelArr,
      );
      await curFilm.$set('directors', directorsId);
      curFilm.directors = directors;

      const montageId = this.getIdsFromModelArr(dto.montages, staffModelArr);
      const montages = this.getFilmModelsFromModelArr(
        dto.montages,
        staffModelArr,
      );
      await curFilm.$set('montages', montageId);
      curFilm.montages = montages;

      const operarotsId = this.getIdsFromModelArr(dto.operators, staffModelArr);
      const operators = this.getFilmModelsFromModelArr(
        dto.operators,
        staffModelArr,
      );
      await curFilm.$set('operators', operarotsId);
      curFilm.operators = operators;

      if (!curFilm.countScore || curFilm.countScore == 0) {
        curFilm.countScore = Math.floor(Math.random() * 5000000);
      }
      if (!curFilm.scoreAVG) {
        curFilm.scoreAVG = this.randomInRange(0, 10);
      }
      await curFilm.save();
    }

    return { status: 'Created' };
  }

  private randomInRange(min: number, max: number): number {
    if (min > max) {
      throw new RpcException(
        new InternalServerErrorException(
          'Minimum value should be smaller than maximum value.',
        ),
      );
    }
    return Math.random() * max + min;
  }

  async getScoreCountByFilm(film_id: number) {
    const film = await this.filmRepository.findByPk(film_id);
    return film.countScore;
  }

  /**
   * Получить массив ID из массива моделей.
   * @param {string[]} names - Список названий.
   * @param {any[]} fromArr - Массив моделей.
   * @returns number[] - Массив ID.
   */
  getIdsFromModelArr(names: string[], fromArr: any[]): number[] {
    return fromArr.map((item) => {
      if (names.includes(item.name)) {
        return item.id;
      }
    });
  }

  /**
   * Получить массив моеделий относящихся к фильму из общего массива моделей.
   * @param {string[]} names - Список названий.
   * @param {any[]} fromArr - Массив моделей.
   * @returns number[] - Массив ID.
   */
  getFilmModelsFromModelArr(names: string[], fromArr: any[]): any[] {
    return fromArr.map((item) => {
      if (names.includes(item.name)) {
        return item;
      }
    });
  }

  /**
   * Создать модель зрителей фильма.
   * @param {CreateSpectatorDto} spectator - DTO для создания зрителей.
   * @returns Spectators - Созданая модель зрителей.
   * @throws NotFoundException
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

  /**
   * Отправить запрос на микросервис для получения страны по названию.
   * @param {string} name - Название страны.
   * @returns Country - Найденная страна.
   */
  async getCountryByName(name: string): Promise<Country> {
    return lastValueFrom(
      this.countryClient.send<Country>({ cmd: 'findOneByNameCountry' }, name),
    );
  }

  /**
   * Создать один новый фильм.
   * @param {CreateFilmDto} dto - DTO для создания фильма.
   * @returns Film - Созданный фильм.
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

  /**
   * Получить список всех фильмов.
   * @returns Film[] - Список найденных фильмов.
   */
  async findAll(): Promise<Film[]> {
    const films = await this.filmRepository.findAll({
      include: { all: true },
    });

    return films;
  }

  /**
   * Получить один фильм по ID.
   * @param {number} id - Идентификатор фильма.
   * @returns Film - Найденный фильм.
   * @throws NotFoundException
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

  /**
   * Обновить данные о фильме.
   * @param {number} id - Идентификатор фильма.
   * @param {UpdateFilmDto} dto - DTO для обновления данных о фильме.
   * @throws NotFoundException
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

    await film.save();

    return film;
  }

  /**
   * Удалить фильм.
   * @param {number} id - Идентификатор фильма.
   * @returns Результат выполнения функции.
   */
  async remove(id: number): Promise<any> {
    if (!id) {
      throw new RpcException(new BadRequestException('Ошибка ввода'));
    }

    const film = await this.findOne(id);

    await lastValueFrom(this.scoreClient.send('deleteAllByFilm', film.id));
    await lastValueFrom(
      this.reviewClient.send('deleteAllByFilmReview', film.id),
    );

    await film.destroy();

    return { statusCode: HttpStatus.OK, value: 'Фильм удален' };
  }

  /**
   * Получить массив участников из масива DTO фильма.
   * @param {CreateFilmDto[]} createFilmDtoArray - Массив DTO для создания фильма.
   * @returns CreateStaffDto[] - Массив DTO для создания участников.
   */
  getStaffArray(createFilmDtoArray: CreateFilmDto[]): CreateStaffDto[] {
    let staffArray: CreateStaffDto[] = [];

    if (!createFilmDtoArray) {
      throw new RpcException(new BadRequestException('Ошибка заполнения'));
    }

    createFilmDtoArray.forEach((value) => {
      value.director.forEach((name) => {
        if (!staffArray.find((value) => value.name == name)) {
          staffArray.push({ name, types: [STAFF_TYPES.DIRECTOR] });
        } else if (
          !staffArray.find((value) =>
            value.types.includes(STAFF_TYPES.DIRECTOR),
          )
        ) {
          const foundInx = staffArray.findIndex((item) => item.name == name);
          staffArray[foundInx].types.push(STAFF_TYPES.DIRECTOR);
        }
      });
      value.scenario.forEach((name) => {
        if (!staffArray.find((value) => value.name == name)) {
          staffArray.push({ name, types: [STAFF_TYPES.SCENARIO] });
        } else if (
          !staffArray.find((value) =>
            value.types.includes(STAFF_TYPES.SCENARIO),
          )
        ) {
          const foundInx = staffArray.findIndex((item) => item.name == name);
          staffArray[foundInx].types.push(STAFF_TYPES.SCENARIO);
        }
      });
      value.producer.forEach((name) => {
        if (!staffArray.find((value) => value.name == name)) {
          staffArray.push({ name, types: [STAFF_TYPES.PRODUCER] });
        } else if (
          !staffArray.find((value) =>
            value.types.includes(STAFF_TYPES.PRODUCER),
          )
        ) {
          const foundInx = staffArray.findIndex((item) => item.name == name);
          staffArray[foundInx].types.push(STAFF_TYPES.PRODUCER);
        }
      });
      value.operator.forEach((name) => {
        if (!staffArray.find((value) => value.name == name)) {
          staffArray.push({ name, types: [STAFF_TYPES.OPERATOR] });
        } else if (
          !staffArray.find((value) =>
            value.types.includes(STAFF_TYPES.OPERATOR),
          )
        ) {
          const foundInx = staffArray.findIndex((item) => item.name == name);
          staffArray[foundInx].types.push(STAFF_TYPES.OPERATOR);
        }
      });
      value.compositor.forEach((name) => {
        if (!staffArray.find((value) => value.name == name)) {
          staffArray.push({ name, types: [STAFF_TYPES.COMPOSITOR] });
        } else if (
          !staffArray.find((value) =>
            value.types.includes(STAFF_TYPES.COMPOSITOR),
          )
        ) {
          const foundInx = staffArray.findIndex((item) => item.name == name);
          staffArray[foundInx].types.push(STAFF_TYPES.COMPOSITOR);
        }
      });
      value.artist.forEach((name) => {
        if (!staffArray.find((value) => value.name == name)) {
          staffArray.push({ name, types: [STAFF_TYPES.ARTIST] });
        } else if (
          !staffArray.find((value) => value.types.includes(STAFF_TYPES.ARTIST))
        ) {
          const foundInx = staffArray.findIndex((item) => item.name == name);
          staffArray[foundInx].types.push(STAFF_TYPES.ARTIST);
        }
      });
      value.montage.forEach((name) => {
        if (!staffArray.find((value) => value.name == name)) {
          staffArray.push({ name, types: [STAFF_TYPES.MONTAGE] });
        } else if (
          !staffArray.find((value) => value.types.includes(STAFF_TYPES.MONTAGE))
        ) {
          const foundInx = staffArray.findIndex((item) => item.name == name);
          staffArray[foundInx].types.push(STAFF_TYPES.MONTAGE);
        }
      });
      value.actors.forEach((name) => {
        if (!staffArray.find((value) => value.name == name)) {
          staffArray.push({ name, types: [STAFF_TYPES.ACTOR] });
        } else if (
          !staffArray.find((value) => value.types.includes(STAFF_TYPES.ACTOR))
        ) {
          const foundInx = staffArray.findIndex((item) => item.name == name);
          staffArray[foundInx].types.push(STAFF_TYPES.ACTOR);
        }
      });
    });

    return staffArray;
  }

  /**
   * Получить массив стран из масива DTO фильма.
   * @param {CreateFilmDto[]} createFilmDtoArray - Массив DTO для создания фильма.
   * @returns CreateCountryDto[] - Массив DTO для создания стран.
   */
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

  /**
   * Получить массив жанров из масива DTO фильма.
   * @param {CreateFilmDto[]} createFilmDtoArray - Массив DTO для создания фильма.
   * @returns CreateCountryDto[] - Массив DTO для создания жанров.
   */
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

  /**
   * Валидация DTO для создания фильма.
   * @param {CreateFilmDto[]} dtoArray - Массив DTO для создания фильма.
   * @returns CreateFilmDto[]
   */
  validateDtos(dtoArray: CreateFilmDto[]): any[] {
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

  /**
   * Получить массив жанров по массиву названий.
   * @param {string[]} names - Список названий.
   * @returns Genre[] - Массив найденных жанров.
   */
  async getGenresByNames(names: string[]): Promise<Genre[]> {
    return await lastValueFrom(
      this.genreClient.send<Genre[]>({ cmd: 'getGenresByNames' }, names),
    );
  }

  /**
   * Получить массив стран по массиву названий.
   * @param {string[]} names - Список названий.
   * @returns Country[] - Массив найденных стран.
   */
  async getCountriesByNames(names: string[]): Promise<Country[]> {
    return await lastValueFrom(
      this.countryClient.send<Country[]>({ cmd: 'getCountriesByNames' }, names),
    );
  }

  /**
   * Получить массив участников по массиву названий.
   * @param {string[]} names - Список названий.
   * @returns Country[] - Массив найденных участников.
   */
  async getStaffsByNames(names: string[]): Promise<Staff[]> {
    return await lastValueFrom(
      this.staffClient.send<Staff[]>({ cmd: 'getStaffByNames' }, names),
    );
  }

  /**
   * Присвоить жанры фильму.
   * @param {Film} film - Фильм к которму нужно присвоить.
   * @param {Genre[]} genres - Массив жанров.
   */
  async filmApplyGenres(film: Film, genres: Genre[]): Promise<any> {
    const ids = genres.map((item) => item.id);
    await film.$set('genres', ids);
    film.genres = genres;
    await film.save();
  }

  /**
   * Присвоить страны фильму.
   * @param {Film} film - Фильм к которму нужно присвоить.
   * @param {Country[]} countries - Массив стран.
   */
  async filmApplyCountries(film: Film, countries: Country[]): Promise<any> {
    const ids = countries.map((item) => item.id);
    await film.$set('countries', ids);
    film.countries = countries;
    await film.save();
  }

  /**
   * Присвоить сценаристов фильму.
   * @param {Film} film - Фильм к которму нужно присвоить.
   * @param {Staff[]} scenarios - Массив сценаристов.
   */
  async filmApplyScenarios(film: Film, scenarios: Staff[]): Promise<any> {
    const ids = scenarios.map((item) => item.id);
    await film.$set('scenario', ids);
    film.scenario = scenarios;
    await film.save();
  }

  /**
   * Присвоить композиторов фильму.
   * @param {Film} film - Фильм к которму нужно присвоить.
   * @param {Staff[]} compositors - Массив композиторов.
   */
  async filmApplyCompositors(film: Film, compositors: Staff[]): Promise<any> {
    const ids = compositors.map((item) => item.id);
    await film.$set('compositors', ids);
    film.compositors = compositors;
    film.save();
  }

  /**
   * Присвоить актеров фильму.
   * @param {Film} film - Фильм к которму нужно присвоить.
   * @param {Staff[]} actors - Массив актеров.
   */
  async filmApplyActors(film: Film, actors: Staff[]): Promise<any> {
    const ids = actors.map((item) => item.id);
    await film.$set('actors', ids);
    film.actors = actors;
    film.save();
  }

  /**
   * Присвоить художников фильму.
   * @param {Film} film - Фильм к которму нужно присвоить.
   * @param {Staff[]} artists - Массив художников.
   */
  async filmApplyArtists(film: Film, artists: Staff[]): Promise<any> {
    const ids = artists.map((item) => item.id);
    await film.$set('artists', ids);
    film.artists = artists;
    film.save();
  }

  /**
   * Присвоить режисеров фильму.
   * @param {Film} film - Фильм к которму нужно присвоить.
   * @param {Staff[]} directors - Массив режисеров.
   */
  async filmApplyDirectors(film: Film, directors: Staff[]): Promise<any> {
    const ids = directors.map((item) => item.id);
    await film.$set('directors', ids);
    film.directors = directors;
    await film.save();
  }

  /**
   * Присвоить монтаж фильму.
   * @param {Film} film - Фильм к которму нужно присвоить.
   * @param {Staff[]} montages - Массив монтажа.
   */
  async filmApplyMontages(film: Film, montages: Staff[]): Promise<any> {
    const ids = montages.map((item) => item.id);
    await film.$set('montages', ids);
    film.montages = montages;
    await film.save();
  }

  /**
   * Присвоить операторов фильму.
   * @param {Film} film - Фильм к которму нужно присвоить.
   * @param {Staff[]} operators - Массив операторов.
   */
  async filmApplyOperators(film: Film, operators: Staff[]): Promise<any> {
    const ids = operators.map((item) => item.id);
    await film.$set('operators', ids);
    film.operators = operators;
    await film.save();
  }

  /**
   * Получить список фильмов с учетом фильтрации, сортировки и пагинации.
   * @param {FilmPagFilterDto} pageOptionsDto - DTO для фильтрации, сортировки и пагинации фильмов.
   * @returns Film[] - Список найденных фильмов.
   */
  async getFilmWithPag(
    pageOptionsDto: FilmPagFilterDto,
  ): Promise<FilmPagResult> {
    const order: string = pageOptionsDto.order
      ? pageOptionsDto.order
      : Order.ASC;
    const orderBy: string = pageOptionsDto.orderBy
      ? pageOptionsDto.orderBy
      : SORT_PARAMS.rating;
    const minScore: number = await this.filmRepository.min('countScore');
    const maxScore: number = await this.filmRepository.max('countScore');
    const page: number = pageOptionsDto.page ? pageOptionsDto.page : 1;
    const take: number = pageOptionsDto.take ? pageOptionsDto.take : 10;
    const skip = (page - 1) * take;
    const minScoreFilter: number = pageOptionsDto.minCountScore
      ? pageOptionsDto.minCountScore
      : 0;
    const maxScoreFilter: number = pageOptionsDto.maxCountScore
      ? pageOptionsDto.maxCountScore
      : maxScore;

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

    const includes = [];

    if (genreFilter.length > 0) {
      includes.push({
        model: Genre,
        as: 'genres',
        where: {
          name: {
            [Op.or]: genreFilter,
          },
        },
      });
    } else if (genreEnFilter.length > 0) {
      includes.push({
        model: Genre,
        as: 'genres',
        where: {
          name_en: {
            [Op.or]: genreEnFilter,
          },
        },
      });
    } else {
      includes.push({
        model: Genre,
        as: 'genres',
      });
    }
    if (countryFilter.length > 0) {
      includes.push({
        model: Country,
        where: {
          name: {
            [Op.or]: countryFilter,
          },
        },
      });
    } else {
      includes.push({
        model: Country,
        as: 'countries',
      });
    }
    if (actorFilter.length > 0) {
      includes.push({
        model: Staff,
        as: 'actors',
        where: {
          name: {
            [Op.or]: actorFilter,
          },
        },
      });
    }
    if (directorFilter.length > 0) {
      includes.push({
        model: Staff,
        as: 'directors',
        where: {
          name: {
            [Op.or]: directorFilter,
          },
        },
      });
    }

    const films = await this.filmRepository.findAll({
      order: [
        [orderBy, order],
        ['name', Order.ASC],
      ],
      include: includes,
      where: {
        countScore: {
          [Op.between]: [minScoreFilter, maxScoreFilter],
        },
      },
      offset: skip,
      limit: take,
      group: ['id', 'name'],
    });

    const count = await this.filmRepository.count({
      include: includes,
      where: {
        countScore: {
          [Op.between]: [minScoreFilter, maxScoreFilter],
        },
      },
      distinct: true,
      col: 'id',
    });

    return { films, count, minScore, maxScore };
  }

  /**
   * Увеличить рейтинг фильма.
   * @param {number} film_id - Идентификатор фильма.
   * @param {number} count - количество оценок до создания новой.
   * @param {number} value - Значение новой оценки.
   * @returns Результат выполнения функции.
   */
  async incFilmRating(
    film_id: number,
    count: number,
    value: number,
  ): Promise<any> {
    const film = await this.filmRepository.findOne({
      where: { id: film_id },
    });

    if (!film) {
      throw new RpcException(new NotFoundException('Фильм не найден'));
    }

    const newAvgScore: number = this.incRating(count, film.scoreAVG, value);

    film.scoreAVG = newAvgScore;
    await film.save();

    return { statusCode: HttpStatus.OK };
  }

  /**
   * Уменьшить рейтинг фильма.
   * @param {number} film_id - Идентификатор фильма.
   * @param {number} count - количество оценок до создания новой.
   * @param {number} value - Значение новой оценки.
   * @returns Результат выполнения функции.
   */
  async decFilmRating(
    film_id: number,
    count: number,
    value: number,
  ): Promise<any> {
    const film = await this.filmRepository.findOne({
      where: { id: film_id },
    });

    if (!film) {
      throw new RpcException(new NotFoundException('Фильм не найден'));
    }

    const newAvgScore: number = this.decRating(count, film.scoreAVG, value);

    film.scoreAVG = newAvgScore;
    await film.save();

    return { statusCode: HttpStatus.OK };
  }

  /**
   * Обновить рейтинг фильма.
   * @param {number} film_id - Идентификатор фильма.
   * @param {number} count - количество оценок до создания новой.
   * @param {number} old_value - Старое значение новой оценки.
   * @param {number} new_value - Новое значение новой оценки.
   * @returns Результат выполнения функции.
   */
  async updateFilmRating(
    film_id: number,
    count: number,
    old_value: number,
    new_value: number,
  ): Promise<any> {
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

  /**
   * Увеличить рейтинг.
   * @param {number} count - Количество оценок.
   * @param {number} currentRating - Текущий рейтинг фильма.
   * @param {number} value - Занчение новой оценки.
   */
  private incRating(
    count: number,
    currentRating: number,
    value: number,
  ): number {
    let newScoreAvg = currentRating ? currentRating : 0;

    newScoreAvg *= count;
    newScoreAvg += value;
    count++;
    newScoreAvg /= count;

    return newScoreAvg;
  }

  /**
   * Понизить рейтинг.
   * @param {number} count - Количество оценок.
   * @param {number} currentRating - Текущий рейтинг фильма.
   * @param {number} value - Занчение новой оценки.
   */
  private decRating(
    count: number,
    currentRating: number,
    value: number,
  ): number {
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

  /**
   * Обновить рейтинг.
   * @param {number} count - Количество оценок.
   * @param {number} currentRating - Текущий рейтинг фильма.
   * @param {number} oldValue - Занчение старой оценки.
   * @param {number} newValue - Занчение новой оценки.
   */
  private updateRating(
    count: number,
    currentRating: number,
    oldValue: number,
    newValue: number,
  ): number {
    let newScoreAvg = currentRating;

    newScoreAvg *= count;
    newScoreAvg -= oldValue;
    newScoreAvg += newValue;
    newScoreAvg /= count;

    return newScoreAvg;
  }

  /**
   * Проверка существования фильма по ID.
   * @param {number} id - Идентификатор фильма.
   * @returns Результат выполнения функции.
   * @throws BadRequestException
   */
  async checkFilmExistById(id: number): Promise<any> {
    if (!id) {
      throw new RpcException(new BadRequestException('Ошибка ввода'));
    }

    const film = await this.filmRepository.findByPk(id);

    if (!film) {
      throw new RpcException(
        new BadRequestException('Фильма с таким ID не существует'),
      );
    }

    return { statusCode: HttpStatus.OK };
  }

  /**
   * Получить количество фильмов
   */
  async getCountFilms(): Promise<number> {
    const count = await this.filmRepository.count();
    return count;
  }

  /**
   * Поиск фильмов по строке
   */
  async searchFilmsByStr(finder: string): Promise<Film[]> {
    if (!finder) {
      throw new RpcException(new BadRequestException('Строка пустая'));
    }

    finder = `%${finder}%`;
    const films = await this.filmRepository.findAll({
      where: {
        [Op.or]: {
          name: {
            [Op.iLike]: finder,
          },
          name_en: {
            [Op.iLike]: finder,
          },
        },
      },
      limit: 10,
    });
    return films;
  }

  /**
   * Изменить количество оценок фильма.
   */
  async chagneCountScores(
    film_id: number,
    count: number,
    isUp: boolean,
  ): Promise<any> {
    const film = await this.filmRepository.findByPk(film_id);
    if (!film) {
      throw new RpcException(new NotFoundException('Фильм не найден'));
    }
    if (isUp) {
      film.countScore += count;
    } else {
      if (count == 0) {
        film.countScore -= 1;
      } else {
        film.countScore -= count;
      }
    }
    await film.save();
    return { statusCode: HttpStatus.OK };
  }
}
