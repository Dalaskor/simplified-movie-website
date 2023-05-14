import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users/users.service';
import * as bcrypt from 'bcryptjs';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import {
  AddRoleDto,
  CreateUserDto,
  OutputJwtTokens,
  Role,
  TokenResponseDto,
  User,
  VkLoginDto,
} from '@app/models';
import { RolesService } from './roles/roles.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly roleService: RolesService,
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Создание пользователя с правами администратора.
   * @param {CreateUserDto} dto - DTO для создания пользователя.
   * @returns TokenResponseDto - JWT токен.
   */
  async createSuperUser(dto: CreateUserDto): Promise<OutputJwtTokens> {
    const candidate = await this.userService.getUserByEmail(dto.email);

    if (candidate) {
      throw new RpcException(
        new BadRequestException(
          'Пользователь с такой электронной почтой уже существует',
        ),
      );
    }

    const hashPassword = await bcrypt.hash(dto.password, 5);
    const user = await this.userService.createAdmin({
      email: dto.email,
      password: hashPassword,
    });
    const tokens = await this.generateTokens(user);
    const hashRefreshToken = await bcrypt.hash(tokens.refreshToken, 5);
    await this.userService.updateRefreshToken(user.id, hashRefreshToken);

    return tokens;
    // return await this.generateToken(user);
  }

  /**
   * Авторизация пользователя.
   * @param {CreateRoleDto} dto - DTO для создания пользователя.
   * @returns TokenResponseDto - JWT токен.
   */
  async login(dto: CreateUserDto): Promise<OutputJwtTokens> {
    const user = await this.validateUser(dto);
    const tokens = await this.generateTokens(user);
    const hashRefreshToken = await bcrypt.hash(tokens.refreshToken, 5);
    await this.userService.updateRefreshToken(user.id, hashRefreshToken);
    return tokens;
  }

  /**
   * Регистрация нового пользователя.
   * @param {CreateRoleDto} dto - DTO для создания пользователя.
   * @returns TokenResponseDto - JWT токен.
   */
  async registration(dto: CreateUserDto): Promise<OutputJwtTokens> {
    const candidate = await this.userService.getUserByEmail(dto.email);

    if (candidate) {
      throw new RpcException(
        new BadRequestException(
          'Пользователь с такой электронной почтой уже существует',
        ),
      );
    }

    const hashPassword = await bcrypt.hash(dto.password, 5);
    const user = await this.userService.createUser({
      email: dto.email,
      password: hashPassword,
    });
    const tokens = await this.generateTokens(user);
    const hashRefreshToken = await bcrypt.hash(tokens.refreshToken, 5);
    await this.userService.updateRefreshToken(user.id, hashRefreshToken);

    return tokens;
    // return await this.generateToken(user);
  }

  /**
   * Валидация пользователя.
   * @param {CreateUserDto} dto - DTO для создания пользователя.
   * @returns User - Проверенный пользователь.
   */
  private async validateUser(dto: CreateUserDto): Promise<User> {
    const user = await this.userService.getUserByEmail(dto.email);

    if (!user) {
      throw new RpcException(
        new BadRequestException('Неккоректные электронная почта или пароль'),
      );
    }

    const passwordEquals = await bcrypt.compare(dto.password, user.password);

    if (user && passwordEquals) {
      return user;
    }

    throw new RpcException(
      new BadRequestException('Неккоректные электронная почта или пароль'),
    );
  }

  /**
   * Генерация JWT токена.
   * @param {User} user - Пользователь.
   */
  private async generateToken(user: User): Promise<TokenResponseDto> {
    const payload = {
      id: user.id,
      email: user.email,
      roles: user.roles,
    };

    return {
      token: this.jwtService.sign(payload),
    };
  }

  /**
   * Генерация JWT токенов.
   * @param {User} user - Пользователь.
   */
  private async generateTokens(user: User): Promise<OutputJwtTokens> {
    const payload = {
      id: user.id,
      email: user.email,
      roles: user.roles,
    };
    const accessSettings = {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '1h',
    };
    const refreshSettings = {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    };
    const token = await this.jwtService.signAsync(payload, accessSettings);
    const refreshToken = await this.jwtService.signAsync(
      payload,
      refreshSettings,
    );
    return {
      token,
      refreshToken,
    };
  }

  async updateTokens(
    user_id: number,
    refreshToken: string,
  ): Promise<OutputJwtTokens> {
    const user = await this.getUser(user_id);
    const userRefreshToken: string = user.refreshToken;

    if (!user || !userRefreshToken) {
      throw new RpcException(new ForbiddenException('Доступ запрещен'));
    }

    const refreshTokenEquals = await bcrypt.compare(
      refreshToken,
      userRefreshToken,
    );

    if (!refreshTokenEquals) {
      throw new RpcException(new ForbiddenException('Доступ запрещен'));
    }

    const tokens = await this.generateTokens(user);
    const hashRefreshToken = await bcrypt.hash(tokens.refreshToken, 5);
    await this.userService.updateRefreshToken(user.id, hashRefreshToken);
    return tokens;
  }

  /**
   * Обработчик верификации токена.
   */
  async handleValidateUser(data: any): Promise<Boolean> {
    return await this.jwtService.verify(data.token);
  }

  async handleValidateRefreshToken(data: any): Promise<Boolean> {
    return await this.jwtService.verify(data.token, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });
  }

  /**
   * Обработчик верификации токена.
   */
  async handleValidateUserWithRoles(data: any): Promise<Boolean> {
    const checkToken = await this.jwtService.verifyAsync(data.token);
    const checkRoles = await checkToken.roles.some((role: any) =>
      data.requiredRoles.includes(role.value),
    );

    if (checkToken && checkRoles) {
      return checkToken;
    }

    throw new RpcException(new ForbiddenException('Нет доступа'));
  }

  /**
   * Получить пользователя.
   * @param {number} id - Идентификатор пользователя.
   * @returns User - Найденный пользователь.
   */
  async getUser(id: number) {
    const user = await this.userService.getUser(id);

    if (!user) {
      throw new RpcException(new NotFoundException('Пользователь не найден'));
    }

    return user;
  }

  /**
   * OAuth через Google
   */
  async googleLogin(user: any) {
    if (!user) {
      return 'No user from Google';
    }

    const userEmail = user.email;
    const candidate = await this.userService.getUserByEmail(userEmail);

    if (candidate) {
      return this.generateToken(candidate);
    }

    const password = this.gen_password(15);

    return await this.registration({ email: userEmail, password });
  }

  /**
   * Генерация пароля.
   * @param {number} len - Размер пароля.
   */
  gen_password(len: number) {
    let password = '';
    const symbols =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!№;%:?*()_+=';

    for (var i = 0; i < len; i++) {
      password += symbols.charAt(Math.floor(Math.random() * symbols.length));
    }

    return password;
  }

  /**
   * OAuth через vk
   */
  async vkLogin(query: VkLoginDto) {
    if (query.access_token && query.user_id) {
      // const checkToken = await this.validateVkToken(query.access_token);
      // if (checkToken === false) {
        // throw new RpcException(new UnauthorizedException('Токен не валидный'));
      // }

      const password = this.gen_password(15);
      const userDto: CreateUserDto = {
        email: `${query.user_id}@vk.com`,
        password,
      };

      const candidate = await this.userService.getUserByEmail(userDto.email);

      if (candidate) {
        console.log('GENERATE TOKEN');
        return await this.generateToken(candidate);
      }

      return await this.registration(userDto);
    }

    throw new RpcException(
      new UnauthorizedException('Пользователь не авторизован'),
    );
  }

  /**
   * Валидация токена.
   * @param {string} token - JWT токен.
   */
  async validateVkToken(token: string) {
    const url = `https://api.vk.com/method/users.get?access_token=${token}&v=5.131`;
    const req = await lastValueFrom(this.httpService.get(url));
    if (req.data.error) {
        // throw new RpcException(new BadRequestException(`${JSON.stringify(req.data.error)}`))
        throw new RpcException(new BadRequestException(req.data.error.error_msg))
    }
    const tokenData = req.data.response[0];

    if (tokenData.id) {
      return true;
    }

    return false;
  }

  /**
   * Проверка электронной почты.
   * @param {string} email - Электронная почта.
   */
  async checkUserEmail(email: string) {
    const user = await this.userService.getUserByEmail(email);

    if (user) {
      throw new RpcException(
        new BadRequestException('Электронная почта уже занята'),
      );
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Электронная почта свободна',
    };
  }

  /**
   * Добавить роль пользователю.
   * @param {AddRoleDto} dto - DTO для добавления роли пользоветилю.
   */
  async userAddRole(dto: AddRoleDto): Promise<AddRoleDto> {
    return await this.userService.addROle(dto);
  }

  /**
   * Удалить роль пользователю.
   * @param {AddRoleDto} dto - DTO для добавления роли пользоветилю.
   */
  async userRemoveRole(dto: AddRoleDto): Promise<AddRoleDto> {
    return await this.userService.removeRole(dto);
  }

  /**
   * Получить список всех ролей.
   * @returns Role[] - Список найденных ролей.
   */
  async getAllRoles(): Promise<Role[]> {
    return await this.roleService.getAllRoles();
  }

  /**
   * Разлогинить пользователя.
   * @param {number} user_id - Идентификатор пользователя.
   */
  async logout(user_id: number): Promise<any> {
    return await this.userService.removeRefreshToken(user_id);
  }
}
