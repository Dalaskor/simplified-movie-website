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

@Injectable()
export class ReviewService {
    constructor(
        @InjectModel(Review) private reviewRepository: typeof Review,
        @Inject(FILM_SERVICE) private filmClient: ClientProxy,
    ) {}

    /**
     * Создать отзыв.
     * @param {CreateReviewDto} dto - DTO для создания отзыва.
     * @returns Review - Созданный отзыв.
     * @throws BadRequestException
     */
    async create(dto: CreateReviewDto): Promise<Review> {
        /* await lastValueFrom(
            this.filmClient.send('checkFilmExistById', dto.film_id),
        ); */
        await this.checkFilm(dto.film_id);

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

    async checkFilm(film_id: number) {
        return this.filmClient.send('checkFilmExistById', film_id);
    }

    /**
     * Обновить данные отзыва.
     * @param {CreateReviewDto} dto - DTO создания для отзыва.
     * @returns Review - Обновленный отзыв.
     * @throws NotFoundException
     */
    async update(dto: CreateReviewDto): Promise<Review> {
        const review = await this.findOne(dto.film_id, dto.user_id);

        if (!review) {
            throw new RpcException(new NotFoundException('Отзыв не найден'));
        }

        console.log('REVIEW: ', review.text);
        console.log('DTO: ', dto.text);

        review.set('text', dto.text);

        console.log('REVIEW: ', review.text);
        console.log('DTO: ', dto.text);

        await review.save();

        return review;
    }

    /**
     * Удалить отзыв.
     * @param {number} film_id - Идентификатор фильма.
     * @param {number} user_id - Идентификатор пользователя,
     * который написал отзыв.
     * @returns Результат удаления отзыва.
     * @throws NotFoundException
     */
    async delete(film_id: number, user_id: number): Promise<any> {
        const review = await this.findOne(film_id, user_id);

        if (!review) {
            throw new RpcException(new NotFoundException('Отзыв не найден'));
        }

        await review.destroy();

        return { statusCode: HttpStatus.OK, message: 'Отзыв удален' };
    }

    /**
     * Получить один отзыв.
     * @param {number} film_id - Идентификатор фильма.
     * @param {number} user_id - Идентификатор пользователя,
     * который написал отзыв.
     * @returns Review - Найденный отзыв.
     * @throws NotFoundException
     */
    async getOne(film_id: number, user_id: number): Promise<Review> {
        const review = await this.findOne(film_id, user_id);

        if (!review) {
            throw new RpcException(new NotFoundException('Отзыв не найден'));
        }

        return review;
    }

    /**
     * Получить все отзывы на фильм.
     * @param {number} film_id - Идентификатор фильма.
     * @returns Review[] - Список найденных отзывов.
     */
    async getAllByFilm(film_id: number): Promise<Review[]> {
        const reviews = await this.reviewRepository.findAll({
            where: { film_id },
        });

        return reviews;
    }

    /**
     * Получить все отзывы пользователя.
     * @param {number} user_id - Идентификатор пользователя.
     * @returns Review[] - Список найденных отзывов.
     */
    async getAllByUser(user_id: number): Promise<Review[]> {
        const reviews = await this.reviewRepository.findAll({
            where: { user_id },
        });

        return reviews;
    }

    /**
     * Удалить все отзывы к фильму.
     * @param {number} film_id - Идентификатор фильма.
     * @returns number - Количество удаленных отзывов.
     */
    async deleteAllByFilm(film_id: number): Promise<number> {
        return await this.reviewRepository.destroy({ where: { film_id } });
    }

    /**
     * Получить количество отзывов к фильму.
     * @param {number} film_id - Идентификатор фильма.
     * @returns number - Количество отзывов к фильму.
     */
    async getCountByFilm(film_id: number): Promise<number> {
        return await this.reviewRepository.count({ where: { film_id } });
    }

    /**
     * Получить один отзыв.
     * @param {number} film_id - Идентификатор фильма.
     * @param {number} user_id - Идентификатор пользователя,
     * @returns Review - Найденный отзыв.
     */
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
