import { FILM_SERVICE } from '@app/common';
import { CreateScoreDto, DeleteScoreDto, Film, Score } from '@app/models';
import { UpdateScoreDto } from '@app/models/dtos/update-score.dto';
import {
    BadRequestException,
    HttpCode,
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

    async create(dto: CreateScoreDto) {
        await lastValueFrom(
            this.filmClient.send('checkFilmExistById', dto.film_id),
        );

        const count = await this.getCount(dto.film_id);
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

    async update(dto: UpdateScoreDto) {
        const count = await this.getCount(dto.film_id);
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

    async delete(dto: DeleteScoreDto) {
        const count = await this.getCount(dto.film_id);
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

    private async findOne(film_id: number, user_id: number) {
        const score = await this.scoreRepository.findOne({
            where: {
                user_id,
                film_id,
            },
        });

        return score;
    }

    private async getCount(film_id: number) {
        let count = await this.scoreRepository.count({
            where: { film_id },
        });

        return count;
    }
}
