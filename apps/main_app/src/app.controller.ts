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
import { HttpService } from '@nestjs/axios';
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
import { ClientProxy, Payload } from '@nestjs/microservices';
import { CreateUserDto } from 'apps/auth/src/users/dto/create-user.dto';
import { CreateCountryDto } from 'apps/country/src/dto/create-country.dto';
import { UpdateCountryDto } from 'apps/country/src/dto/update-country.dto';
import { CreateFilmDto } from 'apps/film/src/dto/create-film.dto';
import { UpdateFilmDto } from 'apps/film/src/dto/update-film.dto';
import { CreateGenreDto } from 'apps/genre/src/dto/create-genre.dto';
import { UpdateGenreDto } from 'apps/genre/src/dto/update-genre.dto';
import { CreateStaffDto } from 'apps/staff/src/dto/create-staff.dto';
import { UpdateStaffDto } from 'apps/staff/src/dto/update-staff.dto';
import { lastValueFrom } from 'rxjs';
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
    async fillDb(@Body() dtoArray: CreateFilmDto[]) {
        // await lastValueFrom(this.filmClient.emit('createManyFilm', dtoArray));
        // return { status: HttpStatus.CREATED };

        return this.filmClient.send('createManyFilm', dtoArray);
    }

    //Auth endpoints
    @Post('/registration')
    async registration(@Body() dto: CreateUserDto) {
        return this.authClient.send('registration', dto);
    }

    @Post('/login')
    async login(@Body() dto: CreateUserDto) {
        return this.authClient.send('login', dto);
    }

    @Post('/create-test-admin')
    async createTestAdmin(@Body() dto: CreateUserDto) {
        return this.authClient.send('createSuperUser', dto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/user/:id')
    async getUser(@Param('id') id: number) {
        return this.authClient.send('getUser', id);
    }

    @Get('/google')
    @UseGuards(GoogleAuthGuard)
    async googleAuth(@Req() req: any) {}

    @Get('/google/redirect')
    @UseGuards(GoogleAuthGuard)
    async googleAuthRedirect(@Req() req: any) {
        return this.authClient.send('googleAuthRedirect', req.user);
    }

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

    @Get('/vk/callback')
    async vkAuthRedirect(@Res() res: any, @Query() query: any) {
        const VKDATA = {
            client_id: this.configService.get('VK_CLIENT_ID'),
            client_secret: this.configService.get('VK_CLIENT_SECRET'),
            callback: this.configService.get('VK_CALLBACK'),
        };

        const url = `https://oauth.vk.com/access_token?client_id=${VKDATA.client_id}&client_secret=${VKDATA.client_secret}&redirect_uri=${VKDATA.callback}&code=${query.code}`;
        res.redirect(url);
    }

    @Post('/vk/login')
    async vkAuthResult(@Body() vkLoginDto: VkLoginDto) {
        return this.authClient.send('loginByVk', vkLoginDto);
    }

    // Film endpoints
    @Roles(ROLES.ADMIN)
    @UseGuards(RolesGuard)
    @Post('/films')
    async createFilm(@Body() dto: CreateFilmDto) {
        return this.filmClient.send('createFilm', dto);
    }

    @Get('/films')
    async getFilms() {
        return this.filmClient.send('findAllFilm', {});
    }

    @Get('/films/:id')
    async getFilmById(@Param('id') id: number) {
        return this.filmClient.send('findOneFilm', id);
    }

    @Roles(ROLES.ADMIN)
    @UseGuards(RolesGuard)
    @Put('/film-update')
    async updateFilm(@Body() dto: UpdateFilmDto) {
        return this.filmClient.send('updateFilm', dto);
    }

    @Roles(ROLES.ADMIN)
    @UseGuards(RolesGuard)
    @Delete('/films/:id')
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
