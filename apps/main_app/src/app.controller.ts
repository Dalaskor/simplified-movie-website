import {
    COUNTRY_SERVICE,
    FILM_SERVICE,
    GENRE_SERVICE,
    JwtAuthGuard,
    PageOptionsDto,
    ROLES,
    STAFF_SERVICE,
} from '@app/common';
import { GoogleAuthGuard } from '@app/common/auth/google-auth.decorator';
import { Roles } from '@app/common/auth/roles-auth.decorator';
import { RolesGuard } from '@app/common/auth/roles.guard';
import { AUTH_SERVICE } from '@app/common/auth/service';
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
import { ClientProxy } from '@nestjs/microservices';
import {
    ApiBody,
    ApiParam,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from 'apps/auth/src/users/dto/create-user.dto';
import { CreateCountryDto } from 'apps/country/src/dto/create-country.dto';
import { UpdateCountryDto } from 'apps/country/src/dto/update-country.dto';
import { CreateFilmDto } from 'apps/film/src/dto/create-film.dto';
import { UpdateFilmDto } from 'apps/film/src/dto/update-film.dto';
import { CreateGenreDto } from 'apps/genre/src/dto/create-genre.dto';
import { UpdateGenreDto } from 'apps/genre/src/dto/update-genre.dto';
import { CreateStaffDto } from 'apps/staff/src/dto/create-staff.dto';
import { UpdateStaffDto } from 'apps/staff/src/dto/update-staff.dto';
import { GoogleResponseDto } from './dto/google-response.dto';
import { VkLoginDto } from './dto/vk-login.dto';

@Controller()
export class AppController {
    constructor(
        @Inject(FILM_SERVICE) private filmClient: ClientProxy,
        @Inject(GENRE_SERVICE) private genreClient: ClientProxy,
        @Inject(STAFF_SERVICE) private staffClient: ClientProxy,
        @Inject(COUNTRY_SERVICE) private countryClient: ClientProxy,
        @Inject(AUTH_SERVICE) private authClient: ClientProxy,
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
        return this.filmClient.send('createManyFilm', dtoArray);
    }

    //Auth endpoints
    @ApiTags('Авторизация')
    @Post('/registration')
    @ApiBody({ type: CreateUserDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Успешная регистрация',
    })
    @ApiBody({ type: CreateUserDto })
    async registration(@Body() dto: CreateUserDto) {
        return this.authClient.send('registration', dto);
    }

    @ApiTags('Авторизация')
    @Post('/login')
    @ApiBody({ type: CreateUserDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Успешная авторизация',
    })
    async login(@Body() dto: CreateUserDto) {
        return this.authClient.send('login', dto);
    }

    @ApiTags('Авторизация')
    @Post('/create-test-admin')
    @ApiBody({ type: CreateUserDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Успешная регистрация администратора',
    })
    async createTestAdmin(@Body() dto: CreateUserDto) {
        return this.authClient.send('createSuperUser', dto);
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
    async getUser(@Param('id') id: number) {
        return this.authClient.send('getUser', id);
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
        return this.authClient.send('googleAuthRedirect', req.user);
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
        return this.authClient.send('loginByVk', vkLoginDto);
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
        status: HttpStatus.OK,
        type: CreateFilmDto,
    })
    async createFilm(@Body() dto: CreateFilmDto) {
        return this.filmClient.send('createFilm', dto);
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
        return this.filmClient.send('findAllFilm', {});
    }

    @ApiTags('Фильмы')
    @Get('/films')
    @ApiResponse({
        type: CreateFilmDto,
        status: HttpStatus.OK,
        isArray: true,
    })
    async getFilmWithPag(@Query() pageOptionsDto: PageOptionsDto) {
        return this.filmClient.send('getFilmsWithPag', pageOptionsDto);
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
        return this.filmClient.send('findOneFilm', id);
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
        return this.filmClient.send('updateFilm', dto);
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
        return this.filmClient.send('removeFilm', id);
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
        status: HttpStatus.OK,
        type: CreateGenreDto,
    })
    async createGenre(@Body() dto: CreateGenreDto) {
        return this.genreClient.send('createGenre', dto);
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
        return this.genreClient.send('findAllGenre', {});
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
        return this.genreClient.send('findOneGenre', id);
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
        return this.genreClient.send('updateGenre', dto);
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
        return this.genreClient.send('removeGenre', id);
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
        status: HttpStatus.OK,
    })
    async createStaff(@Body() dto: CreateStaffDto) {
        return this.staffClient.send('createStaff', dto);
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
        return this.staffClient.send('findAllStaff', {});
    }

    @ApiTags('Участники')
    @Get('/staffs')
    @ApiResponse({
        type: CreateStaffDto,
        status: HttpStatus.OK,
        isArray: true,
    })
    async getStaffsWithPag(@Query() pageOptionsDto: PageOptionsDto) {
        return this.staffClient.send('getStaffsWithPag', pageOptionsDto);
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
        return this.staffClient.send('findOneStaff', id);
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
        return this.staffClient.send('updateStaff', dto);
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
        return this.staffClient.send('removeStaff', id);
    }

    // Country endpoints
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
        status: HttpStatus.OK,
    })
    async createCountry(@Body() dto: CreateCountryDto) {
        return this.countryClient.send('createCountry', dto);
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
        return this.countryClient.send('findAllCountry', {});
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
        return this.countryClient.send('findOneCountry', id);
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
        status: HttpStatus.OK,
    })
    async updateCountry(@Body() dto: UpdateCountryDto) {
        return this.countryClient.send('updateCountry', dto);
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
        status: HttpStatus.OK,
        description: 'Успешно удалено',
    })
    async deleteCountry(@Param('id') id: number) {
        return this.countryClient.send('removeCountry', id);
    }
}
