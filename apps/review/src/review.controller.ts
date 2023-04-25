import { CreateReviewDto, Review } from '@app/models';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ReviewService } from './review.service';

interface ReviewData {
    film_id: number;
    user_id: number;
}

@Controller()
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {}

    /**
     * Создать отзыв.
     * @param {CreateReviewDto} dto - DTO для создания отзыва.
     * @returns Review - Созданный отзыв.
     */
    @MessagePattern('createReview')
    async create(@Payload() dto: CreateReviewDto): Promise<Review> {
        return await this.reviewService.create(dto);
    }

    /**
     * Обновить данные отзыва.
     * @param {CreateReviewDto} dto - DTO создания для отзыва.
     * @returns Review - Обновленный отзыв.
     */
    @MessagePattern('updateReview')
    async update(@Payload() dto: CreateReviewDto): Promise<Review> {
        return await this.reviewService.update(dto);
    }

    /**
     * Удалить отзыв.
     * @param {ReviewData} data - Объект хронящий в себе
     * {number} film_id и {number} user_id.
     * @returns Результат удаления отзыва.
     */
    @MessagePattern('deleteReview')
    async delete(@Payload() data: ReviewData): Promise<any> {
        return await this.reviewService.delete(data.film_id, data.user_id);
    }

    /**
     * Получить один отзыв.
     * @param {ReviewData} data - Объект хронящий в себе
     * {number} film_id и {number} user_id.
     * @returns Review - Найденный отзыв.
     */
    @MessagePattern('getOneReview')
    async getOne(@Payload() data: ReviewData): Promise<Review> {
        return await this.reviewService.getOne(data.film_id, data.user_id);
    }

    /**
     * Получить все отзывы на фильм.
     * @param {number} film_id - Идентификатор фильма.
     * @returns Review[] - Список найденных отзывов.
     */
    @MessagePattern('getAllByFilmReview')
    async getAllByFilm(@Payload() film_id: number): Promise<Review[]> {
        return await this.reviewService.getAllByFilm(film_id);
    }

    /**
     * Получить все отзывы пользователя.
     * @param {number} user_id - Идентификатор пользователя.
     * @returns Review[] - Список найденных отзывов.
     */
    @MessagePattern('getAllByUserReview')
    async getAllByUser(@Payload() user_id: number): Promise<Review[]> {
        return await this.reviewService.getAllByUser(user_id);
    }

    /**
     * Удалить все отзывы к фильму.
     * @param {number} film_id - Идентификатор фильма.
     * @returns number - Количество удаленных отзывов.
     */
    @MessagePattern('deleteAllByFilmReview')
    async deleteAllByFilm(@Payload() film_id: number): Promise<number> {
        return await this.reviewService.deleteAllByFilm(film_id);
    }

    /**
     * Получить количество отзывов к фильму.
     * @param {number} film_id - Идентификатор фильма.
     * @returns number - Количество отзывов к фильму.
     */
    @MessagePattern('getCountByFilm')
    async getCountByFilm(@Payload() film_id: number): Promise<number> {
        return await this.reviewService.getCountByFilm(film_id);
    }
}
