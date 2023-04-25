import { FILM_SERVICE } from '@app/common';
import { CreateReviewDto, Review } from '@app/models';
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
export class ReviewService {
    constructor(
        @InjectModel(Review) private reviewRepository: typeof Review,
        @Inject(FILM_SERVICE) private filmClient: ClientProxy,
    ) {}

    async create(dto: CreateReviewDto): Promise<Review> {
        await lastValueFrom(
            this.filmClient.send('checkFilmExistById', dto.film_id),
        );

        const candidate = await this.findOne(dto.film_id, dto.user_id);

        if (candidate) {
            throw new RpcException(
                new BadRequestException('Отзыв уже существует'),
            );
        }

        const review = await this.reviewRepository.create(dto);

        if (!review) {
            throw new RpcException(
                new BadRequestException('Ошибка создания отзыва'),
            );
        }

        return review;
    }

    async update(dto: CreateReviewDto): Promise<Review> {
        const review = await this.findOne(dto.film_id, dto.user_id);

        if (!review) {
            throw new RpcException(new NotFoundException('Отзыв не найден'));
        }

        console.log('REVIEW: ', review.text);
        console.log('DTO: ', dto.text);

        // review.text = dto.text;
        review.set('text', dto.text);

        console.log('REVIEW: ', review.text);
        console.log('DTO: ', dto.text);

        await review.save();

        return review;
    }

    async delete(film_id: number, user_id: number): Promise<any> {
        const review = await this.findOne(film_id, user_id);

        if (!review) {
            throw new RpcException(new NotFoundException('Отзыв не найден'));
        }

        await review.destroy();

        return { statusCode: HttpStatus.OK, message: 'Отзыв удален' };
    }

    async getOne(film_id: number, user_id: number): Promise<Review> {
        const review = await this.findOne(film_id, user_id);

        if (!review) {
            throw new RpcException(new NotFoundException('Отзыв не найден'));
        }

        return review;
    }

    async getAllByFilm(film_id: number): Promise<Review[]> {
        const reviews = await this.reviewRepository.findAll({
            where: { film_id },
        });

        return reviews;
    }

    async getAllByUser(user_id: number): Promise<Review[]> {
        const reviews = await this.reviewRepository.findAll({
            where: { user_id },
        });

        return reviews;
    }

    async deleteAllByFilm(film_id: number): Promise<number> {
        return await this.reviewRepository.destroy({ where: { film_id } });
    }

    private async findOne(film_id: number, user_id: number): Promise<Review> {
        const review = await this.reviewRepository.findOne({
            where: {
                user_id,
                film_id,
            },
        });

        return review;
    }
}
