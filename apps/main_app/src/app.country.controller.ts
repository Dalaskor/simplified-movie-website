import { COUNTRY_SERVICE, ROLES } from '@app/common';
import { Roles } from '@app/common/auth/roles-auth.decorator';
import { RolesGuard } from '@app/common/auth/roles.guard';
import { CreateCountryDto, UpdateCountryDto } from '@app/models';
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
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { catchError, throwError } from 'rxjs';

@Controller()
export class AppCountryController {
  constructor(@Inject(COUNTRY_SERVICE) private countryClient: ClientProxy) {}

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
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'JWT токен не указан в заголовках',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Некоректный JWT токен или нет роли админа',
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
  @Roles(ROLES.ADMIN)
  @UseGuards(RolesGuard)
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
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'JWT токен не указан в заголовках',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Некоректный JWT токен или нет роли админа',
  })
  async getOneCountry(@Param('id') id: number) {
    if(!Number(id)) {
        throw new BadRequestException('Ошибка ввода');
    }
    return this.countryClient
      .send('findOneCountry', id)
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
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'JWT токен не указан в заголовках',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Некоректный JWT токен или нет роли админа',
  })
  async deleteCountry(@Param('id') id: number) {
    if(!Number(id)) {
        throw new BadRequestException('Ошибка ввода');
    }
    return this.countryClient
      .send('removeCountry', id)
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
  async updateCountry(@Body() dto: UpdateCountryDto) {
    return this.countryClient
      .send('updateCountry', dto)
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }
}
