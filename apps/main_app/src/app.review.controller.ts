import { REVIEW_SERVICE, ROLES } from '@app/common';
import { Roles } from '@app/common/auth/roles-auth.decorator';
import { RolesGuard } from '@app/common/auth/roles.guard';
import { CreateReviewDto } from '@app/models';
import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Inject,
    Param,
    Post,
    Put,
    UseGuards,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { catchError, throwError } from 'rxjs';

@Controller()
export class AppReviewController {
    constructor(@Inject(REVIEW_SERVICE) private reviewClient: ClientProxy) {}

    @ApiTags('Отзывы')
    @Roles(ROLES.USER)
    @UseGuards(RolesGuard)
    @Post('/reviews')
    @ApiOperation({ summary: 'Создать отзыв к фильму' })
    @ApiBody({
        type: CreateReviewDto,
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        type: CreateReviewDto,
    })
    async createReview(@Body() dto: CreateReviewDto) {
        return this.reviewClient
            .send('createReview', dto)
            .pipe(
                catchError((error) =>
                    throwError(() => new RpcException(error.response)),
                ),
            );
    }

    @ApiTags('Отзывы')
    @Roles(ROLES.USER)
    @UseGuards(RolesGuard)
    @Put('/reviews')
    @ApiOperation({ summary: 'Обновить отзыв к фильму' })
    @ApiBody({
        type: CreateReviewDto,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: CreateReviewDto,
    })
    async updateReview(@Body() dto: CreateReviewDto) {
        return this.reviewClient
            .send('updateReview', dto)
            .pipe(
                catchError((error) =>
                    throwError(() => new RpcException(error.response)),
                ),
            );
    }

    @ApiTags('Отзывы')
    @Roles(ROLES.USER)
    @UseGuards(RolesGuard)
    @Delete('/reviews/:film_id/:user_id')
    @ApiOperation({ summary: 'Удалить отзыв к фильму' })
    @ApiResponse({
        status: HttpStatus.OK,
        type: CreateReviewDto,
    })
    async deleteReview(
        @Param('film_id') film_id: number,
        @Param('user_id') user_id: number,
    ) {
        return this.reviewClient
            .send('deleteReview', { film_id, user_id })
            .pipe(
                catchError((error) =>
                    throwError(() => new RpcException(error.response)),
                ),
            );
    }

    @ApiTags('Отзывы')
    @Get('/reviews/count/:film_id')
    @ApiOperation({ summary: 'Получить количество отзывов к фильму' })
    @ApiResponse({
        status: HttpStatus.OK,
        type: CreateReviewDto,
    })
    async getCountByFilmReview(@Param('film_id') film_id: number) {
        return this.reviewClient
            .send('getCountByFilm', film_id)
            .pipe(
                catchError((error) =>
                    throwError(() => new RpcException(error.response)),
                ),
            );
    }

    @ApiTags('Отзывы')
    @Get('/reviews/film/:film_id')
    @ApiOperation({ summary: 'Получить все отзывы по фильму' })
    @ApiResponse({
        status: HttpStatus.OK,
        type: CreateReviewDto,
    })
    async getAllByFilmReview(@Param('film_id') film_id: number) {
        return this.reviewClient
            .send('getAllByFilmReview', film_id)
            .pipe(
                catchError((error) =>
                    throwError(() => new RpcException(error.response)),
                ),
            );
    }

    @ApiTags('Отзывы')
    @Get('/reviews/user/:user_id')
    @ApiOperation({ summary: 'Получить все отзывы пользователя' })
    @ApiResponse({
        status: HttpStatus.OK,
        type: CreateReviewDto,
    })
    async getAllByUserReview(@Param('user_id') user_id: number) {
        return this.reviewClient
            .send('getAllByUserReview', user_id)
            .pipe(
                catchError((error) =>
                    throwError(() => new RpcException(error.response)),
                ),
            );
    }

    @ApiTags('Отзывы')
    @Get('/reviews/:film_id/:user_id')
    @ApiOperation({ summary: 'Получить один отзыв' })
    @ApiResponse({
        status: HttpStatus.OK,
        type: CreateReviewDto,
    })
    async getOneReview(
        @Param('film_id') film_id: number,
        @Param('user_id') user_id: number,
    ) {
        return this.reviewClient
            .send('getOneReview', { film_id, user_id })
            .pipe(
                catchError((error) =>
                    throwError(() => new RpcException(error.response)),
                ),
            );
    }
}
