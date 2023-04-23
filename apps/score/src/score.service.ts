import { CreateScoreDto, DeleteScoreDto, Film, Score } from '@app/models';
import { UpdateScoreDto } from '@app/models/dtos/update-score.dto';
import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class ScoreService {
    constructor(
        @InjectModel(Score) private readonly scoreRepository: typeof Score,
        @InjectModel(Film) private readonly filmRepository: typeof Film,
    ) {}

    async create(dto: CreateScoreDto) {
        const count = await this.getCount(dto.film_id);
        const candidate = await this.findOne(dto.film_id, dto.user_id);

        if (candidate) {
            throw new RpcException(
                new BadRequestException('Оценка уже существует'),
            );
        }

        const film = await this.filmRepository.findOne({
            where: { id: dto.film_id },
        });

        if (!film) {
            throw new RpcException(new NotFoundException('Фильм не найден'));
        }

        const score = await this.scoreRepository.create(dto);

        if (!score) {
            throw new RpcException(
                new BadRequestException('Ошибка создания оценки'),
            );
        }

        if (count == 0) {
            film.scoreAVG = score.value;
        } else {
            const newScoreAvg = this.incRating(
                count,
                film.scoreAVG,
                score.value,
            );

            film.scoreAVG = newScoreAvg;

            await film.save();
        }

        return score;
    }

    async update(dto: UpdateScoreDto) {
        const count = await this.getCount(dto.film_id);
        const score = await this.findOne(dto.film_id, dto.user_id);

        if (!score) {
            throw new RpcException(new NotFoundException('Оценка не найдена'));
        }

        const film = await this.filmRepository.findOne({
            where: { id: dto.film_id },
        });

        if (!film) {
            throw new RpcException(new NotFoundException('Фильм не найден'));
        }

        const oldValue = score.value;

        score.value = dto.value;
        film.scoreAVG = this.updateRating(
            count,
            film.scoreAVG,
            oldValue,
            dto.value,
        );

        await score.save();
        await film.save();

        return score;
    }

    async delete(dto: DeleteScoreDto) {
        const count = await this.getCount(dto.film_id);
        const score = await this.findOne(dto.film_id, dto.user_id);

        if (!score) {
            throw new RpcException(new NotFoundException('Оценка не найдена'));
        }

        const film = await this.filmRepository.findOne({
            where: { id: dto.film_id },
        });

        if (!film) {
            throw new RpcException(new NotFoundException('Фильм не найден'));
        }

        film.scoreAVG = this.decRating(count, film.scoreAVG, score.value);
        await score.destroy();

        return { message: 'Оценка удалена' };
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

    private incRating(count: number, currentRating: number, value: number) {
        let newScoreAvg = currentRating;

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
