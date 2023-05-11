import { CreateScoreDto, DeleteScoreDto, Score } from '@app/models';
import { UpdateScoreDto } from '@app/models/dtos/update-score.dto';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ScoreService } from './score.service';

interface ScoreData {
  film_id: number;
  user_id: number;
}

@Controller()
export class ScoreController {
  constructor(private readonly scoreService: ScoreService) {}

  /**
   * Создание новой оценки.
   * @param {CreateStaffDto} dto - DTO для создания оценки.
   * @returns Score - Созданная оценка.
   */
  @MessagePattern('createScore')
  async create(@Payload() dto: CreateScoreDto): Promise<Score> {
    return await this.scoreService.create(dto);
  }

  /**
   * Получить оценку пользователя на фильм.
   * @param {ScoreData} data - Объект хронящий в себе
   * {number} film_id и {number} user_id.
   * @returns Score - Оценка пользователя на фильм.
   */
  @MessagePattern('getScoreByUser')
  async getScoreByUser(@Payload() data: ScoreData): Promise<Score> {
    return await this.scoreService.getScoreByUser(data.film_id, data.user_id);
  }

  /**
   * Обновить оценку пользователя на фильм.
   * @param {UpdateStaffDto} dto - DTO для обновления оценки.
   * @returns UpdateScoreDto - Обновленные данные об оценке фильма.
   */
  @MessagePattern('updateScore')
  async update(@Payload() dto: UpdateScoreDto): Promise<UpdateScoreDto> {
    return await this.scoreService.update(dto);
  }

  /**
   * Удалить оценку пользователя.
   * @param {DeleteScoreDto} dto - DTO для удаления оценки.
   * @returns Результат удаления оценки.
   */
  @MessagePattern('deleteScore')
  async delete(@Payload() dto: DeleteScoreDto): Promise<any> {
    return await this.scoreService.delete(dto);
  }

  /**
   * Удалить все оценки связанные с определенным фильмом.
   * @param {number} film_id - Идентификтор фильма.
   * @returns Результат удаления оценок.
   */
  @MessagePattern('deleteAllByFilm')
  async deleteAllByFilm(@Payload() film_id: number): Promise<any> {
    return await this.scoreService.deleteAllByFilm(film_id);
  }

  /**
   * Получить количество оценок на фильм.
   * @param(number) film_id - Идентификтор фильма.
   * @returns number - Количество оценок на фильм.
   */
  @MessagePattern('getCountByFilm')
  async getCountByFilm(@Payload() film_id: number): Promise<number> {
    return await this.scoreService.getCountByFilm(film_id);
  }
}
