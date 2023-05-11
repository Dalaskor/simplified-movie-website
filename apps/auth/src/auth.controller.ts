import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import {
  AddRoleDto,
  CreateUserDto,
  OutputJwtTokens,
  RefreshTokensDto,
  Role,
  TokenResponseDto,
  User,
} from '@app/models';
import { HttpStatusCode } from 'axios';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Регистрация нового пользователя.
   * @param {CreateRoleDto} dto - DTO для создания пользователя.
   * @returns TokenResponseDto - JWT токен.
   */
  @MessagePattern('registration')
  async registration(@Payload() dto: CreateUserDto): Promise<OutputJwtTokens> {
    return await this.authService.registration(dto);
  }

  /**
   * Авторизация пользователя.
   * @param {CreateRoleDto} dto - DTO для создания пользователя.
   * @returns TokenResponseDto - JWT токен.
   */
  @MessagePattern('login')
  async login(@Payload() dto: CreateUserDto): Promise<OutputJwtTokens> {
    return await this.authService.login(dto);
  }

  /**
   * Разлогинить пользователя.
   * @param {number} user_id - Идентификатор пользователя.
   */
  @MessagePattern('logout')
  async logout(user_id: number): Promise<any> {
    await this.authService.logout(user_id);
    return {
      message: 'Операция прошла успешно',
      statusCode: HttpStatusCode.Ok,
    };
  }

  /**
   * Обновление JWT токенов.
   * @param {any} data - Объект содержащий token
   */
  @MessagePattern('refreshTokens')
  async handleUpdateTokens(
    @Payload() data: RefreshTokensDto,
  ): Promise<OutputJwtTokens> {
    return await this.authService.updateTokens(data.user_id, data.refreshToken);
  }

  /**
   * Проверка валидации JWT токена.
   * @param {any} data - Объект содержащий token
   */
  @MessagePattern('validate_user')
  async handleValidateUser(@Payload() data: any): Promise<Boolean> {
    return await this.authService.handleValidateUser(data);
  }

  /**
   * Проверка валидации JWT refresh токена.
   * @param {any} data - Объект содержащий token
   */
  @MessagePattern('validate_refresh_token')
  async handleValidateRefreshToken(@Payload() data: any): Promise<Boolean> {
    return await this.authService.handleValidateRefreshToken(data);
  }

  /**
   * Проверка валидации JWT токена.
   * @param {any} data - Объект содержащий token
   */
  @MessagePattern('validate_user_with_roles')
  async handleValidateUserWithRoles(@Payload() data: any): Promise<Boolean> {
    return await this.authService.handleValidateUserWithRoles(data);
  }

  /**
   * Создание пользователя с правами администратора.
   * @param {CreateUserDto} dto - DTO для создания пользователя.
   * @returns TokenResponseDto - JWT токен.
   */
  @MessagePattern('createSuperUser')
  async createSuperUser(
    @Payload() dto: CreateUserDto,
  ): Promise<TokenResponseDto> {
    return await this.authService.createSuperUser(dto);
  }

  /**
   * Получить пользователя.
   * @param {number} id - Идентификатор пользователя.
   * @returns User - Найденный пользователь.
   */
  @MessagePattern('getUser')
  async getUser(@Payload() id: number): Promise<User> {
    return await this.authService.getUser(id);
  }

  /**
   * OAuth через Google
   */
  @MessagePattern('googleAuthRedirect')
  async googleAuthRedirect(@Payload() user: any) {
    return await this.authService.googleLogin(user);
  }

  /**
   * OAuth через vk
   */
  @MessagePattern('loginByVk')
  async vkLogin(@Payload() query: any) {
    return await this.authService.vkLogin(query);
  }

  /**
   * Проверка занятости email.
   * @param {string} email - Email пользователя.
   */
  @MessagePattern('checkUserEmail')
  async checkUserEmail(@Payload() email: string): Promise<any> {
    return await this.authService.checkUserEmail(email);
  }

  /**
   * Добавить роль пользователю.
   * @param {AddRoleDto} dto - DTO для добавления роли пользоветилю.
   */
  @MessagePattern('userAddRole')
  async userAddRole(@Payload() dto: AddRoleDto): Promise<AddRoleDto> {
    return await this.authService.userAddRole(dto);
  }

  /**
   * Удалить роль пользователю.
   * @param {AddRoleDto} dto - DTO для добавления роли пользоветилю.
   */
  @MessagePattern('userRemoveRole')
  async userRemoveRole(@Payload() dto: AddRoleDto): Promise<AddRoleDto> {
    return await this.authService.userRemoveRole(dto);
  }

  /**
   * Получить список всех ролей.
   * @returns Role[] - Список найденных ролей.
   */
  @MessagePattern('getAllRoles')
  async getAllRoles(): Promise<Role[]> {
    return await this.authService.getAllRoles();
  }
}
