import { GENRE_SERVICE, ROLES } from '@app/common';
import { Roles } from '@app/common/auth/roles-auth.decorator';
import { RolesGuard } from '@app/common/auth/roles.guard';
import { CreateGenreDto, GenrePag, UpdateGenreDto } from '@app/models';
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
import { catchError, throwError } from 'rxjs';

@Controller()
export class AppGenreController {
  constructor(@Inject(GENRE_SERVICE) private genreClient: ClientProxy) {}

  @ApiTags('Жанры')
  @ApiOperation({ summary: 'Создать жанр' })
  @Roles(ROLES.ADMIN)
  @UseGuards(RolesGuard)
  @Post('/genres')
  @ApiBody({
    type: CreateGenreDto,
    description: 'Создание жанра',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CreateGenreDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'JWT токен не указан в заголовках',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Некоректный JWT токен или нет роли админа',
  })
  async createGenre(@Body() dto: CreateGenreDto) {
    return this.genreClient
      .send('createGenre', dto)
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }

  @ApiTags('Жанры')
  @ApiOperation({ summary: 'Получить список всех жанров' })
  @Get('/genres')
  @ApiResponse({
    type: CreateGenreDto,
    isArray: true,
    description: 'Получить список жанров',
    status: HttpStatus.OK,
  })
  async getGenres(@Query() pageOptionsDto: GenrePag) {
    return this.genreClient
      .send('findAllGenre', pageOptionsDto)
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }

  @ApiTags('Жанры')
  @ApiOperation({ summary: 'Получить данные о жанре по ID' })
  @Get('/genres/:id')
  @ApiParam({
    name: 'id',
    example: 1,
    required: true,
    description: 'Идентификатор жанра в базе данных',
    type: Number,
  })
  @ApiResponse({
    type: CreateGenreDto,
    status: HttpStatus.OK,
  })
  async getOneGenre(@Param('id') id: number) {
    if(!Number(id)) {
        throw new BadRequestException('Ошибка ввода');
    }
    return this.genreClient
      .send('findOneGenre', id)
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }

  @ApiTags('Жанры')
  @ApiOperation({ summary: 'Удалить жанр' })
  @Roles(ROLES.ADMIN)
  @UseGuards(RolesGuard)
  @Delete('/genres/:id')
  @ApiParam({
    name: 'id',
    example: 1,
    required: true,
    description: 'Идентификатор жанра в базе данных',
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
  async deleteGenre(@Param('id') id: number) {
    if(!Number(id)) {
        throw new BadRequestException('Ошибка ввода');
    }
    return this.genreClient
      .send('removeGenre', id)
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }

  @ApiTags('Жанры')
  @ApiOperation({ summary: 'Обновить данные о жанре' })
  @Roles(ROLES.ADMIN)
  @UseGuards(RolesGuard)
  @Put('/genre-update')
  @ApiBody({
    type: UpdateGenreDto,
    description: 'Обновить данные о жанре',
  })
  @ApiResponse({
    type: CreateGenreDto,
    status: HttpStatus.OK,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'JWT токен не указан в заголовках',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Некоректный JWT токен или нет роли админа',
  })
  async updateGenre(@Body() dto: UpdateGenreDto) {
    return this.genreClient
      .send('updateGenre', dto)
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }
}
