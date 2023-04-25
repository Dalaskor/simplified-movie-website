import { CreateReviewDto, Review } from '@app/models';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ReviewService } from './review.service';

@Controller()
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {}

    @MessagePattern('createReview')
    async create(@Payload() dto: CreateReviewDto): Promise<Review> {
        return await this.reviewService.create(dto);
    }

    @MessagePattern('updateReview')
    async update(@Payload() dto: CreateReviewDto): Promise<Review> {
        return await this.reviewService.update(dto);
    }

    @MessagePattern('deleteReview')
    async delete(@Payload() data: any): Promise<any> {
        return await this.reviewService.delete(data.film_id, data.user_id);
    }

    @MessagePattern('getOneReview')
    async getOne(@Payload() data: any): Promise<Review> {
        return await this.reviewService.getOne(data.film_id, data.user_id);
    }

    @MessagePattern('getAllByFilmReview')
    async getAllByFilm(@Payload() film_id: number): Promise<Review[]> {
        return await this.reviewService.getAllByFilm(film_id);
    }

    @MessagePattern('getAllByUserReview')
    async getAllByUser(@Payload() user_id: number): Promise<Review[]> {
        return await this.reviewService.getAllByUser(user_id);
    }

    @MessagePattern('deleteAllByFilmReview')
    async deleteAllByFilm(@Payload() film_id: number): Promise<number> {
        return await this.reviewService.deleteAllByFilm(film_id);
    }
}
