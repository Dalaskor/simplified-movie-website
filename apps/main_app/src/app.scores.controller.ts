import { ROLES, SCORE_SERVICE } from '@app/common';
import { Roles } from '@app/common/auth/roles-auth.decorator';
import { RolesGuard } from '@app/common/auth/roles.guard';
import { CreateScoreDto, DeleteScoreDto } from '@app/models';
import { UpdateScoreDto } from '@app/models/dtos/update-score.dto';
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
export class AppScoresController {
  constructor(@Inject(SCORE_SERVICE) private scoreClient: ClientProxy) {}

  @ApiTags('Оценки')
  @Roles(ROLES.USER)
  @UseGuards(RolesGuard)
  @Post('/scores')
  @ApiOperation({ summary: 'Поставить пользовательскую оценку фильму' })
  @ApiBody({
    type: CreateScoreDto,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CreateScoreDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'JWT токен не указан в заголовках',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Некоректный JWT токен или нет роли пользователя',
  })
  async createScore(@Body() dto: CreateScoreDto) {
    return this.scoreClient
      .send('createScore', dto)
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }

  @ApiTags('Оценки')
  @Roles(ROLES.USER)
  @UseGuards(RolesGuard)
  @Put('/scores')
  @ApiOperation({
    summary: 'Обновить значение пользовательской оценки фильма',
  })
  @ApiBody({
    type: UpdateScoreDto,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CreateScoreDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'JWT токен не указан в заголовках',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Некоректный JWT токен или нет роли пользователя',
  })
  async updateScore(@Body() dto: UpdateScoreDto) {
    return this.scoreClient
      .send('updateScore', dto)
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }

  @ApiTags('Оценки')
  @Roles(ROLES.USER)
  @UseGuards(RolesGuard)
  @Delete('/scores')
  @ApiOperation({ summary: 'Удалить пользовательскую оценку фильма' })
  @ApiBody({
    type: DeleteScoreDto,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CreateScoreDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'JWT токен не указан в заголовках',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Некоректный JWT токен или нет роли пользователя',
  })
  async deleteScore(@Body() dto: DeleteScoreDto) {
    return this.scoreClient
      .send('deleteScore', dto)
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }

  @ApiTags('Оценки')
  @Get('/scores/count/:film_id')
  @ApiOperation({ summary: 'Получить количество оценок фильма' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CreateScoreDto,
  })
  async getCountByFilmScores(@Param('film_id') film_id: number) {
    if(!Number(film_id)) {
        throw new BadRequestException('Ошибка ввода');
    }
    return this.scoreClient
      .send('getCountByFilm', film_id)
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }

  @ApiTags('Оценки')
  @Get('/scores/:film_id/:user_id')
  @ApiOperation({ summary: 'Получить оценку пользователя на фильм' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CreateScoreDto,
  })
  async getScoreByUser(
    @Param('film_id') film_id: number,
    @Param('user_id') user_id: number,
  ) {
    if(!Number(film_id)) {
        throw new BadRequestException('Ошибка ввода');
    }
    if(!Number(user_id)) {
        throw new BadRequestException('Ошибка ввода');
    }
    return this.scoreClient
      .send('getScoreByUser', { film_id, user_id })
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }
}
