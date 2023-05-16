import { ROLES, STAFF_SERVICE } from '@app/common';
import { Roles } from '@app/common/auth/roles-auth.decorator';
import { RolesGuard } from '@app/common/auth/roles.guard';
import { CreateStaffDto, StaffPagFilter, UpdateStaffDto } from '@app/models';
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
export class AppStaffController {
  constructor(@Inject(STAFF_SERVICE) private staffClient: ClientProxy) {}

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
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'JWT токен не указан в заголовках',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Некоректный JWT токен или нет роли админа',
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
  @ApiOperation({
    summary: 'Поиск актеров и режисеров по строке',
  })
  @Get('/staffs/search/:str')
  @ApiParam({
    name: 'str',
    example: 'lorem',
    required: true,
    description: 'Строка для поиска актеров и режиссеров',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Список участников",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Пустая строка',
  })
  async searchFilmByStr(@Param('str') finder: string) {
    return this.staffClient
      .send('searchActorsDirectorsByStr', finder)
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
    if(!Number(id)) {
        throw new BadRequestException('Ошибка ввода');
    }
    return this.staffClient
      .send('findOneStaff', id)
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
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'JWT токен не указан в заголовках',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Некоректный JWT токен или нет роли админа',
  })
  async deleteStaff(@Param('id') id: number) {
    if(typeof id != 'number') {
        throw new BadRequestException('Ошибка ввода');
    }
    return this.staffClient
      .send('removeStaff', id)
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
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'JWT токен не указан в заголовках',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Некоректный JWT токен или нет роли админа',
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
}
