import { JwtAuthGuard, JwtRefreshGuard, ROLES } from '@app/common';
import { GoogleAuthGuard } from '@app/common/auth/google-auth.decorator';
import { Roles } from '@app/common/auth/roles-auth.decorator';
import { RolesGuard } from '@app/common/auth/roles.guard';
import { AUTH_SERVICE } from '@app/common/auth/service';
import {
  AddRoleDto,
  CreateUserDto,
  ExceptionDto,
  GoogleResponseDto,
  OutputJwtTokens,
  RefreshTokensDto,
  TokenResponseDto,
  VkLoginDto,
} from '@app/models';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  Param,
  Post,
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
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { catchError, throwError } from 'rxjs';

@Controller()
export class AppAuthController {
  constructor(
    @Inject(AUTH_SERVICE) private authClient: ClientProxy,
    private configService: ConfigService,
  ) {}

  @ApiTags('Авторизация')
  @ApiOperation({ summary: 'Регистрация пользователя' })
  @Post('/registration')
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Успешная регистрация',
    type: OutputJwtTokens,
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
    type: OutputJwtTokens,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
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
    type: OutputJwtTokens,
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
    summary: 'Проверка на наличие прав администратора. (Необходим JWT токен)',
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
    status: HttpStatus.CREATED,
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
  @Delete('/remove-role')
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
  @Get('/get-all-roles')
  @ApiOperation({
    summary: 'Получить список ролей',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Операция прошла успешно.',
  })
  async getAllRoles() {
    return this.authClient
      .send('getAllRoles', {})
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }

  @ApiTags('Авторизация')
  @Post('/refresh-tokens/:user_id')
  @ApiOperation({
    summary:
      'Обновить токены для пользователя (требуется refreshToken в заголовке)',
  })
  @ApiBody({
    type: RefreshTokensDto,
    description: `
    user_id - id пользователя, которому требуется обновить JWT токены\n
    refreshToken - текущий refreshToken пользователя полученный при логине/регистрации
    `,
  })
  @ApiParam({
    name: 'id',
    example: 1,
    required: true,
    description: 'Идентификатор пользователя в базе данных',
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Операция прошла успешно.',
    type: OutputJwtTokens,
  })
  @UseGuards(JwtRefreshGuard)
  async refreshTokens(@Param('user_id') user_id: number, @Req() req: any) {
    return this.authClient
      .send('refreshTokens', {user_id, refreshToken: req.refreshToken})
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }
}
