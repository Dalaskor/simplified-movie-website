import { GENRE_ORDERBY, Order } from '@app/common';
import {
  CreateGenreDto,
  Genre,
  GenrePag,
  PageOptionsDto,
  UpdateGenreDto,
} from '@app/models';
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

@Injectable()
export class GenreService {
  constructor(@InjectModel(Genre) private genreRepository: typeof Genre) {}

  /**
   * Заполнить бд жанрами.
   * @param {CreateReviewDto[]} createGenreDtoArray - Список жанров.
   * @returns Genre[] - Список созданных жанров.
   * @throws BadRequestException
   */
  async createMany(createGenreDtoArray: CreateGenreDto[]): Promise<Genre[]> {
    const genres = await this.genreRepository.bulkCreate(createGenreDtoArray, {
      ignoreDuplicates: true,
    });

    if (!genres) {
      throw new RpcException(
        new BadRequestException('Ошибка заполнения жанров.'),
      );
    }

    return genres;
  }

  /**
   * Создать один жанр.
   * @param {CreateGenreDto} createGenreDto - DTO для создания жанра.
   * @returns Genre - Созданный жанр
   * @throws BadRequestException
   */
  async create(createGenreDto: CreateGenreDto): Promise<Genre> {
    const genre = this.genreRepository.create(createGenreDto);

    if (!genre) {
      throw new RpcException(new BadRequestException('Ошибка создания жанра.'));
    }

    return genre;
  }

  /**
   * Получить список всех жанров.
   * @returns Genre[] - Список найденных жанров.
   */
  async findAll(pageOptionsDto: GenrePag): Promise<Genre[]> {
    const order: string = pageOptionsDto.order
      ? pageOptionsDto.order
      : Order.ASC;
    const orderBy: string = pageOptionsDto.orderBy
      ? pageOptionsDto.orderBy
      : GENRE_ORDERBY.name;
    const page: number = pageOptionsDto.page ? pageOptionsDto.page : 1;
    const take: number = pageOptionsDto.take ? pageOptionsDto.take : 50;
    const skip = (page - 1) * take;

    const genres = this.genreRepository.findAll({
      order: [[orderBy, order]],
      offset: skip,
      limit: take,
    });

    return genres;
  }

  /**
   * Найти один жанр.
   * @param {number} id - Идентификатор жанра.
   * @returns Найденный жанр.
   * @throws NotFoundException
   */
  async findOne(id: number): Promise<Genre> {
    const genre = this.genreRepository.findOne({ where: { id } });

    if (!genre) {
      throw new RpcException(new NotFoundException('Жанр не найден'));
    }

    return genre;
  }

  /**
   * Обновить данные о жанре.
   * @param {number} id - Идентификатор жанра.
   * @param {UpdateStaffDto} dto - DTO для обновления жанра.
   * @returns Genre - Обновленный жанр.
   */
  async update(id: number, dto: UpdateGenreDto): Promise<Genre> {
    const genre = await this.findOne(id);

    dto.name ? (genre.name = dto.name) : '';
    dto.name_en ? (genre.name_en = dto.name_en) : '';

    await genre.save();

    return genre;
  }

  /**
   * Удалить жанр.
   * @param {number} id - Идентификатор жанра.
   * @returns Результат удаления жанра.
   */
  async remove(id: number): Promise<any> {
    const genre = await this.findOne(id);

    await genre.destroy();

    return { status: HttpStatus.OK };
  }

  /**
   * Найти жанры по списку названий.
   * @param {string[]} names - Список названий жанров.
   * @returns Genre[] - Список найденных жанров.
   * @throws NotFoundException
   */
  async getGenresByNamesArray(names: string[]): Promise<Genre[]> {
    const genres = await this.genreRepository.findAll({
      where: {
        name: {
          [Op.or]: names,
        },
      },
    });

    if (!genres) {
      throw new RpcException(new NotFoundException('Жанры не найдены'));
    }

    return genres;
  }
}
