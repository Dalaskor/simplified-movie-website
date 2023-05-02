import { FILM_SERVICE, ROLES } from '@app/common';
import { Roles } from '@app/common/auth/roles-auth.decorator';
import { RolesGuard } from '@app/common/auth/roles.guard';
import { CreateFilmDto, FilmPagFilterDto, UpdateFilmDto } from '@app/models';
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
    async createFilm(@Body() dto: CreateFilmDto) {
        return this.filmClient
            .send('createFilm', dto)
            .pipe(
                catchError((error) =>
                    throwError(() => new RpcException(error.response)),
                ),
            );
    }

    /* @ApiTags('Фильмы')
    @ApiOperation({ summary: 'Получить всех список фильмов' })
    @Get('/all-films')
    @ApiResponse({
        type: CreateFilmDto,
        isArray: true,
        description: 'Получить список всех фильмов',
        status: HttpStatus.OK,
    })
    async getFilms() {
        return this.filmClient
            .send('findAllFilm', {})
            .pipe(
                catchError((error) =>
                    throwError(() => new RpcException(error.response)),
                ),
            );
    } */

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
    async getFilmWithPag(@Query() pageOptionsDto: FilmPagFilterDto) {
        return this.filmClient
            .send('getFilmsWithPag', pageOptionsDto)
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
        return this.filmClient
            .send('findOneFilm', id)
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
    async updateFilm(@Body() dto: UpdateFilmDto) {
        return this.filmClient
            .send('updateFilm', dto)
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
    async deleteFilm(@Param('id') id: number) {
        return this.filmClient
            .send('removeFilm', id)
            .pipe(
                catchError((error) =>
                    throwError(() => new RpcException(error.response)),
                ),
            );
    }
}
