import { FilmPagResult, FILM_SERVICE, ROLES } from '@app/common';
import { Roles } from '@app/common/auth/roles-auth.decorator';
import { RolesGuard } from '@app/common/auth/roles.guard';
import { CreateFilmDto, FilmPagFilterDto, UpdateFilmDto } from '@app/models';
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
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { catchError, lastValueFrom, throwError } from 'rxjs';

@Controller()
export class AppFilmController {
  constructor(@Inject(FILM_SERVICE) private filmClient: ClientProxy) {}

  @ApiTags('Фильмы')
  @ApiOperation({ summary: 'Создать фильм' })
  @Roles(ROLES.ADMIN)
  @UseGuards(RolesGuard)
  @Post('/films')
  @ApiBody({
    type: CreateFilmDto,
    description: 'Создание фильма',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CreateFilmDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'JWT токен не указан в заголовках',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Некоректный JWT токен или нет роли админа',
  })
  async createFilm(@Body() dto: CreateFilmDto) {
    return this.filmClient
      .send('createFilm', dto)
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }

  @ApiTags('Фильмы')
  @ApiOperation({
    summary: 'Получить список фильмов с пагинацией и фильтрацией',
  })
  @Get('/films')
  @ApiResponse({
    type: CreateFilmDto,
    status: HttpStatus.OK,
    isArray: true,
  })
  async getFilmWithPag(
    @Query() pageOptionsDto: FilmPagFilterDto,
    @Res() res: any,
  ) {
    const filmPagResult: FilmPagResult = await lastValueFrom(
      this.filmClient.send<FilmPagResult>('getFilmsWithPag', pageOptionsDto),
    );
    await res.header('x-total-count', filmPagResult.count);
    await res.header('x-min-count-score', filmPagResult.minScore);
    await res.header('x-max-count-score', filmPagResult.maxScore);
    await res.send(filmPagResult.films);
  }

  @ApiTags('Фильмы')
  @ApiOperation({
    summary: 'Поиск фильмов по строке',
    description: 'Поиск проходит в полях name и name_en',
  })
  @Get('/films/search/:str')
  @ApiParam({
    name: 'str',
    example: 'lorem',
    required: true,
    description: 'Строка для поиска фильма',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Список фильмов",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Пустая строка',
  })
  async searchFilmByStr(@Param('str') finder: string) {
    return this.filmClient
      .send('searchFilmsByStr', finder)
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }

  @ApiTags('Фильмы')
  @ApiOperation({ summary: 'Получить данные о фильме по ID' })
  @Get('/films/:id')
  @ApiParam({
    name: 'id',
    example: 1,
    required: true,
    description: 'Идентификатор фильма в базе данных',
    type: Number,
  })
  @ApiResponse({
    type: CreateFilmDto,
    status: HttpStatus.OK,
  })
  async getFilmById(@Param('id') id: number) {
    if(!Number(id)) {
        throw new BadRequestException('Ошибка ввода');
    }
    return this.filmClient
      .send('findOneFilm', id)
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }

  @ApiTags('Фильмы')
  @ApiOperation({ summary: 'Удалить фильм' })
  @Roles(ROLES.ADMIN)
  @UseGuards(RolesGuard)
  @Delete('/films/:id')
  @ApiParam({
    name: 'id',
    example: 1,
    required: true,
    description: 'Идентификатор фильма в базе данных',
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Успешно удалено',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'JWT токен не указан в заголовках',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Некоректный JWT токен или нет роли админа',
  })
  async deleteFilm(@Param('id') id: number) {
    if(!Number(id)) {
        throw new BadRequestException('Ошибка ввода');
    }
    return this.filmClient
      .send('removeFilm', id)
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }

  @ApiTags('Фильмы')
  @ApiOperation({ summary: 'Обновить данные о фильме' })
  @Roles(ROLES.ADMIN)
  @UseGuards(RolesGuard)
  @Put('/film-update')
  @ApiBody({
    type: UpdateFilmDto,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CreateFilmDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'JWT токен не указан в заголовках',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Некоректный JWT токен или нет роли админа',
  })
  async updateFilm(@Body() dto: UpdateFilmDto) {
    return this.filmClient
      .send('updateFilm', dto)
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }
}
