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
        await lastValueFrom(
            this.filmClient.send('checkFilmExistById', dto.film_id),
        );

        const count = await this.getCountByFilm(dto.film_id);
        const candidate = await this.findOne(dto.film_id, dto.user_id);

        if (candidate) {
            throw new RpcException(
                new BadRequestException('Оценка уже существует'),
            );
        }

        const score = await this.scoreRepository.create(dto);

        if (!score) {
            throw new RpcException(
                new BadRequestException('Ошибка создания оценки'),
            );
        }

        await lastValueFrom(
            this.filmClient.send('incFilmRating', {
                film_id: score.film_id,
                count: count,
                value: score.value,
            }),
        );

        return score;
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

        await lastValueFrom(
            this.filmClient.send('updateFilmRating', {
                film_id: score.film_id,
                count: count,
                old_value: score.value,
                new_value: dto.value,
            }),
        );

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
        const count = await this.getCountByFilm(dto.film_id);
        const score = await this.findOne(dto.film_id, dto.user_id);

        if (!score) {
            throw new RpcException(new NotFoundException('Оценка не найдена'));
        }

        await lastValueFrom(
            this.filmClient.send('decFilmRating', {
                film_id: score.film_id,
                count: count,
                value: score.value,
            }),
        );

        await score.destroy();

        return { message: 'Оценка удалена' };
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
        return await this.scoreRepository.count({ where: { film_id } });
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
