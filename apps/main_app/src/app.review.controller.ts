import { REVIEW_SERVICE, ROLES } from '@app/common';
import { Roles } from '@app/common/auth/roles-auth.decorator';
import { RolesGuard } from '@app/common/auth/roles.guard';
import {
  CreateReviewDto,
  GetReviewsByParent,
  OutputReviewDto,
  Review,
  UpdateReviewDto,
} from '@app/models';
import {
  BadRequestException,
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
    type: OutputReviewDto,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: OutputReviewDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'JWT токен не указан в заголовках',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Некоректный JWT токен или нет роли пользователя',
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
    type: UpdateReviewDto,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: Review,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'JWT токен не указан в заголовках',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Некоректный JWT токен или нет роли пользователя',
  })
  async updateReview(@Body() dto: UpdateReviewDto) {
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
  @Delete('/reviews/:id')
  @ApiOperation({ summary: 'Удалить отзыв к фильму' })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'JWT токен не указан в заголовках',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Некоректный JWT токен или нет роли пользователя',
  })
  async deleteReview(@Param('id') id: number) {
    if (!Number(id)) {
      throw new BadRequestException('Ошибка ввода');
    }
    return this.reviewClient
      .send('deleteReview', id)
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }

  @ApiTags('Отзывы')
  @Get('/reviews/:id')
  @ApiOperation({ summary: 'Получить один отзыв' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: OutputReviewDto,
  })
  async getOneReview(@Param('id') id: number) {
    if (!Number(id)) {
      throw new BadRequestException('Ошибка ввода');
    }
    return this.reviewClient
      .send('getOneReview', id)
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
  })
  async getCountByFilmReview(@Param('film_id') film_id: number) {
    if (!Number(film_id)) {
      throw new BadRequestException('Ошибка ввода');
    }
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
    type: OutputReviewDto,
    isArray: true,
  })
  async getAllByFilmReview(@Param('film_id') film_id: number) {
    if (!Number(film_id)) {
      throw new BadRequestException('Ошибка ввода');
    }
    return this.reviewClient
      .send('getAllByFilmReview', film_id)
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }

  @ApiTags('Отзывы')
  @Get('/reviews/film/:film_id/:parent_id')
  @ApiOperation({ summary: 'Получить все дочерние коментарии по фильму' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: OutputReviewDto,
    isArray: true,
  })
  async getAllByFilmReviewByParent(
    @Param('film_id') film_id: number,
    @Param('parent_id') parent_id: number,
  ) {
    if (!Number(film_id) || !Number(parent_id)) {
      throw new BadRequestException('Ошибка ввода');
    }
    const data: GetReviewsByParent = { film_id, parent_id };
    return this.reviewClient
      .send('getFilmReviewsByParent', data)
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
    type: OutputReviewDto,
    isArray: true,
  })
  async getAllByUserReview(@Param('user_id') user_id: number) {
    if (!Number(user_id)) {
      throw new BadRequestException('Ошибка ввода');
    }
    return this.reviewClient
      .send('getAllByUserReview', user_id)
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }

  @ApiTags('Отзывы')
  @Get('/reviews/parents/:film_id')
  @ApiOperation({ summary: 'Получить все родительские коментарии к фильму' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CreateReviewDto,
    isArray: true,
  })
  async getFilmReviewsOnlyParents(@Param('film_id') film_id: number) {
    if (!Number(film_id)) {
      throw new BadRequestException('Ошибка ввода');
    }
    return this.reviewClient
      .send('getFilmReviewsOnlyParent', film_id)
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }
}
