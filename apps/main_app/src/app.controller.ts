import {
    COUNTRY_SERVICE,
    FILM_SERVICE,
    GENRE_SERVICE,
    JwtAuthGuard,
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
    HttpCode,
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
    ApiOAuth2,
    ApiParam,
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
    @Get('/films')
    @ApiResponse({
        type: CreateFilmDto,
        status: HttpStatus.OK,
        isArray: true,
    })
    async getFilms() {
        return this.filmClient.send('findAllFilm', {});
    }

    @ApiTags('Фильмы')
    @Get('/films/:id')
    @ApiParam({
        name: 'id',
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
        required: true,
        description: 'Идентификатор фильма в базе данных',
        type: Number,
    })
    @ApiResponse({
        status: HttpStatus.OK,
    })
    async deleteFilm(@Param('id') id: number) {
        return this.filmClient.send('removeFilm', id);
    }

    // Genre endpoints
    @Roles(ROLES.ADMIN)
    @UseGuards(RolesGuard)
    @Post('/genres')
    async createGenre(@Body() dto: CreateGenreDto) {
        return this.genreClient.send('createGenre', dto);
    }

    @Get('/genres')
    async getGenres() {
        return this.genreClient.send('findAllGenre', {});
    }

    @Get('/genres/:id')
    async getOneGenre(@Param('id') id: number) {
        return this.genreClient.send('findOneGenre', id);
    }

    @Roles(ROLES.ADMIN)
    @UseGuards(RolesGuard)
    @Put('/genre-update')
    async updateGenre(@Body() dto: UpdateGenreDto) {
        return this.genreClient.send('updateGenre', dto);
    }

    @Roles(ROLES.ADMIN)
    @UseGuards(RolesGuard)
    @Delete('/genres/:id')
    async deleteGenre(@Param('id') id: number) {
        return this.genreClient.send('removeGenre', id);
    }

    // Staff endpoints
    @Roles(ROLES.ADMIN)
    @UseGuards(RolesGuard)
    @Post('/staffs')
    async createStaff(@Body() dto: CreateStaffDto) {
        return this.staffClient.send('createStaff', dto);
    }

    @Get('/staffs')
    async getStaffs() {
        return this.staffClient.send('findAllStaff', {});
    }

    @Get('/staffs/:id')
    async getOneStaff(@Param('id') id: number) {
        return this.staffClient.send('findOneStaff', id);
    }

    @Roles(ROLES.ADMIN)
    @UseGuards(RolesGuard)
    @Put('/staff-update')
    async updateStaff(@Body() dto: UpdateStaffDto) {
        return this.staffClient.send('updateStaff', dto);
    }

    @Roles(ROLES.ADMIN)
    @UseGuards(RolesGuard)
    @Delete('/staffs/:id')
    async deleteStaff(@Param('id') id: number) {
        return this.staffClient.send('removeStaff', id);
    }

    // Country endpoints
    @Roles(ROLES.ADMIN)
    @UseGuards(RolesGuard)
    @Post('/countries')
    async createCountry(@Body() dto: CreateCountryDto) {
        return this.countryClient.send('createCountry', dto);
    }

    @Get('/countries')
    async getCountry() {
        return this.countryClient.send('findAllCountry', {});
    }

    @Get('/countries/:id')
    async getOneCountry(@Param('id') id: number) {
        return this.countryClient.send('findOneCountry', id);
    }

    @Roles(ROLES.ADMIN)
    @UseGuards(RolesGuard)
    @Put('/country-update')
    async updateCountry(@Body() dto: UpdateCountryDto) {
        return this.countryClient.send('updateCountry', dto);
    }

    @Roles(ROLES.ADMIN)
    @UseGuards(RolesGuard)
    @Delete('/countries/:id')
    async deleteCountry(@Param('id') id: number) {
        return this.countryClient.send('removeCountry', id);
    }
}
