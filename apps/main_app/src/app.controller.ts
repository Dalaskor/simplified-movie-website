import {
    COUNTRY_SERVICE,
    FILM_SERVICE,
    GENRE_SERVICE,
    JwtAuthGuard,
    PageOptionsDto,
    ROLES,
    SCORE_SERVICE,
    STAFF_SERVICE,
} from '@app/common';
import { GoogleAuthGuard } from '@app/common/auth/google-auth.decorator';
import { Roles } from '@app/common/auth/roles-auth.decorator';
import { RolesGuard } from '@app/common/auth/roles.guard';
import { AUTH_SERVICE } from '@app/common/auth/service';
import {
    CreateCountryDto,
    CreateFilmDto,
    CreateGenreDto,
    CreateScoreDto,
    CreateStaffDto,
    CreateUserDto,
    DeleteScoreDto,
    ExceptionDto,
    FilmPagFilterDto,
    GoogleResponseDto,
    TokenResponseDto,
    UpdateCountryDto,
    UpdateFilmDto,
    UpdateGenreDto,
    UpdateStaffDto,
    VkLoginDto,
} from '@app/models';
import { UpdateScoreDto } from '@app/models/dtos/update-score.dto';
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
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import {
    ApiBody,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { catchError, throwError } from 'rxjs';

@Controller()
export class AppController {
    constructor(
        @Inject(FILM_SERVICE) private filmClient: ClientProxy,
        @Inject(GENRE_SERVICE) private genreClient: ClientProxy,
        @Inject(STAFF_SERVICE) private staffClient: ClientProxy,
        @Inject(COUNTRY_SERVICE) private countryClient: ClientProxy,
        @Inject(AUTH_SERVICE) private authClient: ClientProxy,
        @Inject(SCORE_SERVICE) private scoreClient: ClientProxy,
        private configService: ConfigService,
    ) {}

    // Заполнить базу данных из json
    @ApiTags('Заполнение базы данных')
    @Post('/fill-db')
    @ApiBody({ type: [CreateFilmDto] })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'База данных заполнена успешно',
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Произошла ошибка при заполнении',
    })
    async fillDb(@Body() dtoArray: CreateFilmDto[]) {
        return this.filmClient
            .send('createManyFilm', dtoArray)
            .pipe(
                catchError((error) =>
                    throwError(() => new RpcException(error.response)),
                ),
            );
    }

    //Auth endpoints
    @ApiTags('Авторизация')
    @Post('/registration')
    @ApiBody({ type: CreateUserDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Успешная регистрация',
        type: TokenResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Пользователь с такой электронной почтой уже существует',
        type: ExceptionDto,
    })
    @ApiBody({ type: CreateUserDto })
    async registration(@Body() dto: CreateUserDto) {
        return this.authClient
            .send('registration', dto)
            .pipe(
                catchError((error) =>
                    throwError(() => new RpcException(error.response)),
                ),
            );
    }

    @ApiTags('Авторизация')
    @Post('/login')
    @ApiBody({ type: CreateUserDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Успешная авторизация',
        type: TokenResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Неккоректные электронная почта или пароль',
        type: ExceptionDto,
    })
    async login(@Body() dto: CreateUserDto) {
        return this.authClient
            .send('login', dto)
            .pipe(
                catchError((error) =>
                    throwError(() => new RpcException(error.response)),
                ),
            );
    }

    @ApiTags('Авторизация')
    @Post('/create-test-admin')
    @ApiBody({ type: CreateUserDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Успешная регистрация',
        type: TokenResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Пользователь с такой электронной почтой уже существует',
        type: ExceptionDto,
    })
    async createTestAdmin(@Body() dto: CreateUserDto) {
        return this.authClient
            .send('createSuperUser', dto)
            .pipe(
                catchError((error) =>
                    throwError(() => new RpcException(error.response)),
                ),
            );
    }

    @ApiTags('Авторизация')
    @UseGuards(JwtAuthGuard)
    @Get('/user/:id')
    @ApiParam({
        name: 'id',
        example: 1,
        required: true,
        description: 'Идентификатор пользователя в базе данных',
        type: Number,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Получены данные пользователя',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Пользователь не найден',
    })
    async getUser(@Param('id') id: number) {
        return this.authClient
            .send('getUser', id)
            .pipe(
                catchError((error) =>
                    throwError(() => new RpcException(error.response)),
                ),
            );
    }

    @ApiTags('Авторизация')
    @Get('/google')
    @UseGuards(GoogleAuthGuard)
    async googleAuth() {}

    @ApiTags('Авторизация')
    @Get('/google/redirect')
    @ApiResponse({
        type: GoogleResponseDto,
    })
    @UseGuards(GoogleAuthGuard)
    async googleAuthRedirect(@Req() req: any) {
        return this.authClient
            .send('googleAuthRedirect', req.user)
            .pipe(
                catchError((error) =>
                    throwError(() => new RpcException(error.response)),
                ),
            );
    }

    @ApiTags('Авторизация')
    @Get('/vk')
    async vkAuth(@Res() res: any) {
        const VKDATA = {
            client_id: this.configService.get('VK_CLIENT_ID'),
            callback: this.configService.get('VK_CALLBACK'),
            display: 'popup',
        };
        const url = `https://oauth.vk.com/authorize?client_id=${VKDATA.client_id}&redirect_uri=${VKDATA.callback}&display=${VKDATA.display}&scope=phone_number&response_type=code&v=5.131`;

        return res.redirect(url);
    }

    @ApiTags('Авторизация')
    @Get('/vk/callback')
    @ApiResponse({
        type: VkLoginDto,
        status: HttpStatus.OK,
    })
    async vkAuthRedirect(@Res() res: any, @Query() query: any) {
        const VKDATA = {
            client_id: this.configService.get('VK_CLIENT_ID'),
            client_secret: this.configService.get('VK_CLIENT_SECRET'),
            callback: this.configService.get('VK_CALLBACK'),
        };

        const url = `https://oauth.vk.com/access_token?client_id=${VKDATA.client_id}&client_secret=${VKDATA.client_secret}&redirect_uri=${VKDATA.callback}&code=${query.code}`;
        res.redirect(url);
    }

    @ApiTags('Авторизация')
    @Post('/vk/login')
    @ApiBody({
        type: VkLoginDto,
    })
    async vkAuthResult(@Body() vkLoginDto: VkLoginDto) {
        return this.authClient
            .send('loginByVk', vkLoginDto)
            .pipe(
                catchError((error) =>
                    throwError(() => new RpcException(error.response)),
                ),
            );
    }

    // Film endpoints
    @ApiTags('Фильмы')
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

    @ApiTags('Фильмы')
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
    }

    @ApiTags('Фильмы')
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

    // Genre endpoints
    @ApiTags('Жанры')
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
    @Get('/genres')
    @ApiResponse({
        type: CreateGenreDto,
        isArray: true,
        description: 'Получить список жанров',
        status: HttpStatus.OK,
    })
    async getGenres() {
        return this.genreClient
            .send('findAllGenre', {})
            .pipe(
                catchError((error) =>
                    throwError(() => new RpcException(error.response)),
                ),
            );
    }

    @ApiTags('Жанры')
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
        return this.genreClient
            .send('findOneGenre', id)
            .pipe(
                catchError((error) =>
                    throwError(() => new RpcException(error.response)),
                ),
            );
    }

    @ApiTags('Жанры')
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
    async updateGenre(@Body() dto: UpdateGenreDto) {
        return this.genreClient
            .send('updateGenre', dto)
            .pipe(
                catchError((error) =>
                    throwError(() => new RpcException(error.response)),
                ),
            );
    }

    @ApiTags('Жанры')
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
    async deleteGenre(@Param('id') id: number) {
        return this.genreClient
            .send('removeGenre', id)
            .pipe(
                catchError((error) =>
                    throwError(() => new RpcException(error.response)),
                ),
            );
    }

    // Staff endpoints
    @ApiTags('Участники')
    @Roles(ROLES.ADMIN)
    @UseGuards(RolesGuard)
    @Post('/staffs')
    @ApiBody({
        type: CreateStaffDto,
        description: 'Создание участника',
    })
    @ApiResponse({
        type: CreateStaffDto,
        status: HttpStatus.CREATED,
    })
    async createStaff(@Body() dto: CreateStaffDto) {
        return this.staffClient
            .send('createStaff', dto)
            .pipe(
                catchError((error) =>
                    throwError(() => new RpcException(error.response)),
                ),
            );
    }

    @ApiTags('Участники')
    @Get('/all-staffs')
    @ApiResponse({
        type: CreateStaffDto,
        isArray: true,
        description: 'Получить список всех участников',
        status: HttpStatus.OK,
    })
    async getStaffs() {
        return this.staffClient
            .send('findAllStaff', {})
            .pipe(
                catchError((error) =>
                    throwError(() => new RpcException(error.response)),
                ),
            );
    }

    @ApiTags('Участники')
    @Get('/staffs')
    @ApiResponse({
        type: CreateStaffDto,
        status: HttpStatus.OK,
        isArray: true,
    })
    async getStaffsWithPag(@Query() pageOptionsDto: PageOptionsDto) {
        return this.staffClient
            .send('getStaffsWithPag', pageOptionsDto)
            .pipe(
                catchError((error) =>
                    throwError(() => new RpcException(error.response)),
                ),
            );
    }

    @ApiTags('Участники')
    @Get('/staffs/:id')
    @ApiParam({
        name: 'id',
        example: 1,
        required: true,
        description: 'Идентификатор участника в базе данных',
        type: Number,
    })
    @ApiResponse({
        type: CreateStaffDto,
        status: HttpStatus.OK,
    })
    async getOneStaff(@Param('id') id: number) {
        return this.staffClient
            .send('findOneStaff', id)
            .pipe(
                catchError((error) =>
                    throwError(() => new RpcException(error.response)),
                ),
            );
    }

    @ApiTags('Участники')
    @Roles(ROLES.ADMIN)
    @UseGuards(RolesGuard)
    @Put('/staff-update')
    @ApiBody({
        type: UpdateStaffDto,
        description: 'Обновить данные о участнике',
    })
    @ApiResponse({
        type: CreateStaffDto,
        status: HttpStatus.OK,
    })
    async updateStaff(@Body() dto: UpdateStaffDto) {
        return this.staffClient
            .send('updateStaff', dto)
            .pipe(
                catchError((error) =>
                    throwError(() => new RpcException(error.response)),
                ),
            );
    }

    @ApiTags('Участники')
    @Roles(ROLES.ADMIN)
    @UseGuards(RolesGuard)
    @Delete('/staffs/:id')
    @ApiParam({
        name: 'id',
        example: 1,
        required: true,
        description: 'Идентификатор участника в базе данных',
        type: Number,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Успешно удалено',
    })
    async deleteStaff(@Param('id') id: number) {
        return this.staffClient
            .send('removeStaff', id)
            .pipe(
                catchError((error) =>
                    throwError(() => new RpcException(error.response)),
                ),
            );
    }

    ////
    // Country endpoints
    ////
    @ApiTags('Страны')
    @Roles(ROLES.ADMIN)
    @UseGuards(RolesGuard)
    @Post('/countries')
    @ApiBody({
        type: CreateCountryDto,
        description: 'Создание страны',
    })
    @ApiResponse({
        type: CreateCountryDto,
        status: HttpStatus.CREATED,
    })
    async createCountry(@Body() dto: CreateCountryDto) {
        return this.countryClient
            .send('createCountry', dto)
            .pipe(
                catchError((error) =>
                    throwError(() => new RpcException(error.response)),
                ),
            );
    }

    @ApiTags('Страны')
    @Get('/countries')
    @ApiResponse({
        type: CreateCountryDto,
        isArray: true,
        description: 'Получить список стран',
        status: HttpStatus.OK,
    })
    async getCountry() {
        return this.countryClient
            .send('findAllCountry', {})
            .pipe(
                catchError((error) =>
                    throwError(() => new RpcException(error.response)),
                ),
            );
    }

    @ApiTags('Страны')
    @Get('/countries/:id')
    @ApiParam({
        name: 'id',
        example: 1,
        required: true,
        description: 'Идентификатор страны в базе данных',
        type: Number,
    })
    @ApiResponse({
        type: CreateCountryDto,
        status: HttpStatus.OK,
    })
    async getOneCountry(@Param('id') id: number) {
        return this.countryClient
            .send('findOneCountry', id)
            .pipe(
                catchError((error) =>
                    throwError(() => new RpcException(error.response)),
                ),
            );
    }

    @ApiTags('Страны')
    @Roles(ROLES.ADMIN)
    @UseGuards(RolesGuard)
    @Put('/country-update')
    @ApiBody({
        type: UpdateCountryDto,
        description: 'Обновить данные о стране',
    })
    @ApiResponse({
        type: CreateCountryDto,
        status: HttpStatus.CREATED,
    })
    async updateCountry(@Body() dto: UpdateCountryDto) {
        return this.countryClient
            .send('updateCountry', dto)
            .pipe(
                catchError((error) =>
                    throwError(() => new RpcException(error.response)),
                ),
            );
    }

    @ApiTags('Страны')
    @Roles(ROLES.ADMIN)
    @UseGuards(RolesGuard)
    @Delete('/countries/:id')
    @ApiParam({
        name: 'id',
        example: 1,
        required: true,
        description: 'Идентификатор страны в базе данных',
        type: Number,
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Успешно удалено',
    })
    async deleteCountry(@Param('id') id: number) {
        return this.countryClient
            .send('removeCountry', id)
            .pipe(
                catchError((error) =>
                    throwError(() => new RpcException(error.response)),
                ),
            );
    }

    ////
    // Scores endpoints
    ////
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
    async deleteScore(@Body() dto: DeleteScoreDto) {
        return this.scoreClient
            .send('deleteScore', dto)
            .pipe(
                catchError((error) =>
                    throwError(() => new RpcException(error.response)),
                ),
            );
    }
}
