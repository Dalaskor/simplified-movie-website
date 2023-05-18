import { Controller } from '@nestjs/common';
import { FilmService } from './film.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { FilmPagResult, RmqService } from '@app/common';
import {
  CreateFilmDto,
  Film,
  FilmPagFilterDto,
  UpdateFilmDto,
} from '@app/models';

interface FilmRatingData {
  film_id: number;
  count: number;
  value: number;
}

interface FilmRatingUpdateData {
  film_id: number;
  count: number;
  old_value: number;
  new_value: number;
}

interface ChangeScoreCount {
    film_id: number;
    count: number;
    isUp: boolean;
}

@Controller()
export class FilmController {
  constructor(
    private readonly filmService: FilmService,
    private readonly rmqService: RmqService,
  ) {}

  /**
   * Создать массив фильмов при заполнении бд.
   * @param {CreateFilmDto[]} createFilmDtoArray - DTO для создания массива фльмов.
   * @returns Результат выполнения функции.
   */
  @MessagePattern('createManyFilm')
  async createMany(
    @Payload() createFilmDtoArray: CreateFilmDto[],
    @Ctx() context: RmqContext,
  ): Promise<any> {
    this.rmqService.ack(context);
    return await this.filmService.createMany(createFilmDtoArray);
  }

  /**
   * Создать фильм.
   * @param {CreateFilmDto} createFilmDto - DTO для создания фильма.
   * @returns Film - Созданный фильм.
   */
  @MessagePattern('createFilm')
  async create(@Payload() createFilmDto: CreateFilmDto): Promise<Film> {
    return await this.filmService.create(createFilmDto);
  }

  /**
   * Получить список всех фильмов.
   * @returns Film[] - Список найденных фильмов.
   */
  @MessagePattern('findAllFilm')
  async findAll(): Promise<Film[]> {
    return await this.filmService.findAll();
  }

  /**
   * Получить один фильм.
   * @param {number} id - Идентификатор фильма.
   * @returns Film - Найденный фильм.
   */
  @MessagePattern('findOneFilm')
  async findOne(@Payload() id: number): Promise<Film> {
    return await this.filmService.findOne(id);
  }

  /**
   * Обновить данные о фильме.
   * @param {UpdateCountryDto} updateFilmDto - DTO для обновления данных в фильме.
   * @returns Film - Обновленный фильм.
   */
  @MessagePattern('updateFilm')
  async update(@Payload() updateFilmDto: UpdateFilmDto): Promise<Film> {
    return await this.filmService.update(updateFilmDto.id, updateFilmDto);
  }

  /**
   * Удалить фильм.
   * @param {number} id - Идентификатор фильма.
   */
  @MessagePattern('removeFilm')
  async remove(@Payload() id: number): Promise<any> {
    return await this.filmService.remove(id);
  }

  /**
   * Получить список фильмов с учетом фильтрации, сортировки и пагинации.
   * @param {FilmPagFilterDto} pageOptionsDto - DTO для фильтрации, сортировки и пагинации фильмов.
   * @returns Film[] - Список найденных фильмов.
   */
  @MessagePattern('getFilmsWithPag')
  async getFilmsWithPag(
    @Payload() pageOptionsDto: FilmPagFilterDto,
  ): Promise<FilmPagResult> {
    return await this.filmService.getFilmWithPag(pageOptionsDto);
  }

  /**
   * Получить количество фильмов.
   */
  @MessagePattern('getCountFilms')
  async getCountFilms(): Promise<number> {
    return await this.filmService.getCountFilms();
  }

  /**
   * Увеличить рейтинг фильма.
   * @param {FilmRatingData} data - Объект с данными для рейтинга.
   * @returns Результат выполнения функции.
   */
  @MessagePattern('incFilmRating')
  async incFilmRating(@Payload() data: FilmRatingData): Promise<any> {
    return await this.filmService.incFilmRating(
      data.film_id,
      data.count,
      data.value,
    );
  }

  /**
   * Уменьшить рейтинг фильма.
   * @param {FilmRatingData} data - Объект с данными для рейтинга.
   * @returns Результат выполнения функции.
   */
  @MessagePattern('decFilmRating')
  async decFilmRating(@Payload() data: FilmRatingData): Promise<any> {
    return await this.filmService.decFilmRating(
      data.film_id,
      data.count,
      data.value,
    );
  }

  /**
   * Обновить рейтинг фильма.
   * @param {FilmRatingUpdateData} data - Объект с данными для рейтинга.
   * @returns Результат выполнения функции.
   */
  @MessagePattern('updateFilmRating')
  async updateFilmRating(@Payload() data: FilmRatingUpdateData): Promise<any> {
    return await this.filmService.updateFilmRating(
      data.film_id,
      data.count,
      data.old_value,
      data.new_value,
    );
  }

  /**
   * Проверка на существование фильма в бд.
   * @param {number} id - Идентификатор фильма.
   * @returns Результат выполнения функции.
   */
  @MessagePattern('checkFilmExistById')
  async CheckFilmExistById(@Payload() id: number): Promise<any> {
    return await this.filmService.checkFilmExistById(id);
  }

  /**
   * Поиск фильма по строке.
   * @param {string} finder - Строка для поиска.
   * @returns Результат выполнения функции.
   */
  @MessagePattern('searchFilmsByStr')
  async SearchFilmsByStr(@Payload() finder: string): Promise<Film[]> {
    return await this.filmService.searchFilmsByStr(finder);
  }

  /**
   * Изменить количество оценок на фильме.
   */
  @MessagePattern('changeCountScoresForFilm')
  async ChangeCountScoresForFilm(@Payload() data: ChangeScoreCount) {
      return await this.filmService.chagneCountScores(data.film_id, data.count, data.isUp);
  }

  /**
   * Изменить количество оценок на фильме.
   */
  @MessagePattern('getCountScoresForFilm')
  async getCountScoresForFilm(@Payload() film_id: number) {
      return await this.filmService.getScoreCountByFilm(film_id);
  }
}
