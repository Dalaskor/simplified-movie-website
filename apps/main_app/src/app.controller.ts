import {
    COUNTRY_SERVICE,
    FILM_SERVICE,
    GENRE_SERVICE,
    JwtAuthGuard,
    REVIEW_SERVICE,
    ROLES,
    SCORE_SERVICE,
    STAFF_SERVICE,
} from '@app/common';
import { GoogleAuthGuard } from '@app/common/auth/google-auth.decorator';
import { Roles } from '@app/common/auth/roles-auth.decorator';
import { RolesGuard } from '@app/common/auth/roles.guard';
import { AUTH_SERVICE } from '@app/common/auth/service';
import {
    AddRoleDto,
    CreateCountryDto,
    CreateFilmDto,
    CreateGenreDto,
    CreateReviewDto,
    CreateScoreDto,
    CreateStaffDto,
    CreateUserDto,
    DeleteScoreDto,
    ExceptionDto,
    FilmPagFilterDto,
    GoogleResponseDto,
    StaffPagFilter,
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
        @Inject(REVIEW_SERVICE) private reviewClient: ClientProxy,
        private configService: ConfigService,
    ) {}

    // Заполнить базу данных из json
    @ApiTags('Заполнение базы данных')
    @ApiOperation({ summary: 'Заполнение базы данных из файла JSON' })
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
    @ApiOperation({ summary: 'Регистрация пользователя' })
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
    @ApiOperation({ summary: 'Авторизация пользователя' })
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
    @ApiOperation({
        summary: 'Создания администратора для тестирования (временно)',
    })
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
    @ApiOperation({ summary: 'Получить данные пользователя по ID' })
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
    @ApiOperation({ summary: 'Проверка занаята ли электронная почта' })
    @Get('/check-email/:email')
    @ApiParam({
        name: 'email',
        example: 'test@email.ru',
        required: true,
        description: 'Электронная почта',
        type: String,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Электронная почта свободна',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Электронная почта занята',
    })
    async checkEmail(@Param('email') email: string) {
        return this.authClient
            .send('checkUserEmail', email)
            .pipe(
                catchError((error) =>
                    throwError(() => new RpcException(error.response)),
                ),
            );
    }

    @ApiTags('Авторизация')
    @ApiOperation({ summary: 'OAuth через Google' })
    @Get('/google')
    @UseGuards(GoogleAuthGuard)
    async googleAuth() {}

    @ApiTags('Авторизация')
    @ApiOperation({
        summary: 'Редирект для OAuth через Google (Возвращает JWT токен)',
    })
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
    @ApiOperation({ summary: 'OAuth через VK' })
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
    @ApiOperation({
        summary: 'Редирект для OAuth через VK (Возвращает данные из VK)',
    })
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
    @ApiOperation({
        summary: 'Принимает данные из VK, возвращает JWT токен',
    })
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

    @ApiTags('Авторизация')
    @Get('/check-admin')
    @ApiOperation({
        summary:
            'Проверка на наличие прав администратора. (Необходим JWT токен)',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'У пользователя есть права администратора.',
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'У пользователя нет прав администратора.',
    })
    @Roles(ROLES.ADMIN)
    @UseGuards(RolesGuard)
    checkAdmin() {
        return {
            statusCode: HttpStatus.OK,
            message: 'У пользователя есть права администратора.',
        };
    }

    @ApiTags('Авторизация')
    @Post('/add-role')
    @ApiOperation({
        summary: 'Добавить роль пользователю',
    })
    @ApiBody({
        type: AddRoleDto,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Операция прошла успешно.',
    })
    @Roles(ROLES.ADMIN)
    @UseGuards(RolesGuard)
    async userAddRole(@Body() dto: AddRoleDto) {
        return this.authClient
            .send('userAddRole', dto)
            .pipe(
                catchError((error) =>
                    throwError(() => new RpcException(error.response)),
                ),
            );
    }

    @ApiTags('Авторизация')
    @Post('/remove-role')
    @ApiOperation({
        summary: 'Удалить роль у пользователя',
    })
    @ApiBody({
        type: AddRoleDto,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Операция прошла успешно.',
    })
    @Roles(ROLES.ADMIN)
    @UseGuards(RolesGuard)
    async userRemoveRole(@Body() dto: AddRoleDto) {
        return this.authClient
            .send('userRemoveRole', dto)
            .pipe(
                catchError((error) =>
                    throwError(() => new RpcException(error.response)),
                ),
            );
    }

    @ApiTags('Авторизация')
    @Post('/get-all-roles')
    @ApiOperation({
        summary: 'Получить список ролей',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Операция прошла успешно.',
    })
    /* @Roles(ROLES.ADMIN)
    @UseGuards(RolesGuard) */
    async getAllRoles() {
        return this.authClient
            .send('getAllRoles', {})
            .pipe(
                catchError((error) =>
                    throwError(() => new RpcException(error.response)),
                ),
            );
    }

    // Film endpoints
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

    @ApiTags('Фильмы')
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

    // Genre endpoints
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
        return this.genreClient
            .send('findOneGenre', id)
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
    @ApiOperation({ summary: 'Создать участника' })
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
    @ApiOperation({ summary: 'Получить список всех участников' })
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
    @ApiOperation({ summary: 'Получить список участников с пагинацией' })
    @Get('/staffs')
    @ApiResponse({
        type: CreateStaffDto,
        status: HttpStatus.OK,
        isArray: true,
    })
    async getStaffsWithPag(@Query() pageOptionsDto: StaffPagFilter) {
        return this.staffClient
            .send('getStaffsWithPag', pageOptionsDto)
            .pipe(
                catchError((error) =>
                    throwError(() => new RpcException(error.response)),
                ),
            );
    }

    @ApiTags('Участники')
    @ApiOperation({ summary: 'Получить данные участника по ID' })
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
    @ApiOperation({ summary: 'Обновить данные участника' })
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
    @ApiOperation({ summary: 'Удалить участника по ID' })
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
    @ApiOperation({ summary: 'Создать страну' })
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
    @ApiOperation({ summary: 'Получить список всех стран' })
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
    @ApiOperation({ summary: 'Получить данные по стране по ID' })
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
    @ApiOperation({ summary: 'Обновить данные по стране' })
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
    @ApiOperation({ summary: 'Удалить страну' })
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
        status: HttpStatus.OK,
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
    @Get('/scores/count/:film_id')
    @ApiOperation({ summary: 'Получить количество оценок фильма' })
    @ApiResponse({
        status: HttpStatus.OK,
        type: CreateScoreDto,
    })
    async getCountByFilmScores(@Param('film_id') film_id: number) {
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
        return this.scoreClient
            .send('getScoreByUser', { film_id, user_id })
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

    ////
    // Reviews endpoints
    ////
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
