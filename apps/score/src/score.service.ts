import { FILM_SERVICE } from '@app/common';
import { CreateScoreDto, DeleteScoreDto, Score } from '@app/models';
import { UpdateScoreDto } from '@app/models/dtos/update-score.dto';
import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/sequelize';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ScoreService {
  constructor(
    @InjectModel(Score) private readonly scoreRepository: typeof Score,
    @Inject(FILM_SERVICE) private filmClient: ClientProxy,
  ) {}

  /**
   * Создание новой оценки.
   * @param {CreateStaffDto} dto - DTO для создания оценки.
   * @returns Score - Созданная оценка.
   * @throws BadRequestException
   */
  async create(dto: CreateScoreDto): Promise<Score> {
    await this.checkFilm(dto.user_id);

    const count: number = await lastValueFrom(
      this.filmClient.send('getCountScoresForFilm', dto.film_id),
    );
    const candidate = await this.findOne(dto.film_id, dto.user_id);

    if (candidate) {
      throw new RpcException(new BadRequestException('Оценка уже существует'));
    }

    const score = await this.scoreRepository.create(dto);

    if (!score) {
      throw new RpcException(new BadRequestException('Ошибка создания оценки'));
    }

    await this.incFilmRating(score.film_id, count, score.value);
    await this.updateCountScoreByFilm(score.film_id, true);

    return score;
  }

  async checkFilm(film_id: number): Promise<any> {
    return await lastValueFrom(
      this.filmClient.send('checkFilmExistById', film_id),
    );
  }

  /**
   * Обновить оценку пользователя на фильм.
   * @param {UpdateStaffDto} dto - DTO для обновления оценки.
   * @returns UpdateScoreDto - Обновленные данные об оценке фильма.
   * @throws NotFoundException
   */
  async update(dto: UpdateScoreDto) {
    const count = await this.getCountByFilm(dto.film_id);
    const score = await this.findOne(dto.film_id, dto.user_id);

    if (!score) {
      throw new RpcException(new NotFoundException('Оценка не найдена'));
    }

    await this.updateFilmRating(score.film_id, count, score.value, dto.value);

    score.value = dto.value;
    await score.save();

    return score;
  }

  /**
   * Удалить оценку пользователя.
   * @param {DeleteScoreDto} dto - DTO для удаления оценки.
   * @returns Результат удаления оценки.
   * @throws NotFoundException
   */
  async delete(dto: DeleteScoreDto) {
    const count: number = await lastValueFrom(
      this.filmClient.send('getCountScoresForFilm', dto.film_id),
    );
    const score = await this.findOne(dto.film_id, dto.user_id);

    if (!score) {
      throw new RpcException(new NotFoundException('Оценка не найдена'));
    }

    await this.decFilmRating(score.film_id, count, score.value);
    const film_id: number = score.film_id;

    await score.destroy();
    await this.updateCountScoreByFilm(film_id, false);

    return { message: 'Оценка удалена' };
  }

  private async incFilmRating(
    film_id: number,
    count: number,
    value: number,
  ): Promise<any> {
    return await lastValueFrom(
      this.filmClient.send('incFilmRating', {
        film_id,
        count,
        value,
      }),
    );
  }

  private async updateFilmRating(
    film_id: number,
    count: number,
    old_value: number,
    new_value: number,
  ): Promise<any> {
    return await lastValueFrom(
      this.filmClient.send('updateFilmRating', {
        film_id,
        count,
        old_value,
        new_value,
      }),
    );
  }

  private async decFilmRating(
    film_id: number,
    count: number,
    value: number,
  ): Promise<any> {
    return await lastValueFrom(
      this.filmClient.send('decFilmRating', {
        film_id,
        count,
        value,
      }),
    );
  }

  /**
   * Удалить все оценки связанные с определенным фильмом.
   * @param {number} film_id - Идентификтор фильма.
   * @returns Результат удаления оценок.
   */
  async deleteAllByFilm(film_id: number) {
    const count = await this.scoreRepository.destroy({
      where: { film_id },
    });
    await this.updateCountScoreByFilm(film_id, false);

    return {
      statusCode: HttpStatus.OK,
      message: 'Оценки успешно удалены',
      count,
    };
  }

  /**
   * Получить оценку пользователя на фильм.
   * @param {number} film_id - Идентификатор фильма.
   * @param {number} user_id - Идентификатор пользователя.
   * @returns Score - Оценка пользователя на фильм.
   * @throws NotFoundException
   */
  async getScoreByUser(film_id: number, user_id: number) {
    const score = await this.scoreRepository.findOne({
      where: {
        film_id,
        user_id,
      },
    });

    if (!score) {
      throw new RpcException(new NotFoundException('Оценка не найден'));
    }

    return score;
  }

  /**
   * Получить количество оценок на фильм.
   * @param(number) film_id - Идентификтор фильма.
   * @returns number - Количество оценок на фильм.
   */
  async getCountByFilm(film_id: number): Promise<number> {
    let count = await this.scoreRepository.count({ where: { film_id } });
    if (count) {
      return count;
    }
    return 0;
  }

  private async updateCountScoreByFilm(film_id: number, isUp: boolean): Promise<any> {
    const count = await this.getCountByFilm(film_id);
    return await lastValueFrom(
      this.filmClient.send('changeCountScoresForFilm', { film_id, count, isUp }),
    );
  }

  /**
   * Получить одну оценку.
   * @param {number} film_id - Идентификатор фильма.
   * @param {number} user_id - Идентификатор пользователя.
   * @returns Score - Оценка пользователя на фильм.
   */
  private async findOne(film_id: number, user_id: number) {
    const score = await this.scoreRepository.findOne({
      where: {
        user_id,
        film_id,
      },
    });

    return score;
  }
}
