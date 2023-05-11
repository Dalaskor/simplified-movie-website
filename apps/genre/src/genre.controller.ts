import { Controller } from '@nestjs/common';
import { GenreService } from './genre.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateGenreDto, Genre, GenrePag, UpdateGenreDto } from '@app/models';

@Controller()
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  /**
   * Заполнить бд жанрами.
   * @param {CreateReviewDto[]} createGenreDtoArray - Список жанров.
   * @returns Genre[] - Список созданных жанров.
   */
  @MessagePattern('createManyGenre')
  async createMany(
    @Payload() createGenreDtoArray: CreateGenreDto[],
  ): Promise<Genre[]> {
    return await this.genreService.createMany(createGenreDtoArray);
  }

  /**
   * Создать один жанр.
   * @param {CreateGenreDto} createGenreDto - DTO для создания жанра.
   * @returns Genre - Созданный жанр
   */
  @MessagePattern('createGenre')
  async create(@Payload() createGenreDto: CreateGenreDto): Promise<Genre> {
    return await this.genreService.create(createGenreDto);
  }

  /**
   * Получить список всех жанров.
   * @returns Genre[] - Список найденных жанров.
   */
  @MessagePattern('findAllGenre')
  async findAll(dto: GenrePag): Promise<Genre[]> {
    return await this.genreService.findAll(dto);
  }

  /**
   * Найти один жанр.
   * @param {number} id - Идентификатор жанра.
   * @returns Найденный жанр.
   */
  @MessagePattern('findOneGenre')
  async findOne(@Payload() id: number): Promise<Genre> {
    return await this.genreService.findOne(id);
  }

  /**
   * Обновить данные о жанре.
   * @param {UpdateStaffDto} updateGenreDto - DTO для обновления жанра.
   */
  @MessagePattern('updateGenre')
  async update(@Payload() updateGenreDto: UpdateGenreDto): Promise<Genre> {
    return await this.genreService.update(updateGenreDto.id, updateGenreDto);
  }

  /**
   * Удалить жанр.
   * @param {number} id - Идентификатор жанра.
   * @returns Результат удаления жанра.
   */
  @MessagePattern('removeGenre')
  async remove(@Payload() id: number): Promise<any> {
    return await this.genreService.remove(id);
  }

  /**
   * Найти жанры по списку названий.
   * @param {string[]} names - Список названий жанров.
   * @returns Genre[] - Список найденных жанров.
   */
  @MessagePattern({ cmd: 'getGenresByNames' })
  async getGenresByNamesHandle(@Payload() names: string[]): Promise<Genre[]> {
    return await this.genreService.getGenresByNamesArray(names);
  }
}
