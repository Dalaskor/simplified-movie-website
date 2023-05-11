import { ROLES } from '@app/common';
import { AddRoleDto, CreateUserDto, User } from '@app/models';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/sequelize';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly usersRepository: typeof User,
    private roleService: RolesService,
  ) {}

  /**
   * Создать пользователя.
   * @param {CreateRoleDto} dto - DTO для создания пользователя.
   * @returns User - Созданный пользователь.
   */
  async createUser(dto: CreateUserDto): Promise<User> {
    const user = await this.usersRepository.create(dto);
    let role = await this.roleService.getRoleByValue(ROLES.USER);

    if (!role) {
      role = await this.roleService.create({ value: ROLES.USER });
    }

    await user.$set('roles', [role.id]);
    user.roles = [role];

    return user;
  }

  /**
   * Создать пользователя с правами администратора.
   * @param {CreateRoleDto} dto - DTO для создания пользователя.
   * @returns User - Созданный пользователь.
   */
  async createAdmin(dto: CreateUserDto): Promise<User> {
    const user = await this.createUser(dto);
    let role = await this.roleService.getRoleByValue(ROLES.ADMIN);

    if (!role) {
      role = await this.roleService.create({ value: ROLES.ADMIN });
    }

    await user.$add('roles', [role.id]);
    user.roles.push(role);

    return user;
  }

  /**
   * Получить список всех пользователей.
   * @returns User[] - Список найденных пользователей.
   */
  async getAllUsers(): Promise<User[]> {
    const users = await this.usersRepository.findAll({
      include: { all: true },
    });

    return users;
  }

  /**
   * Получить пользователя.
   * @param {number} id - Идентификатор пользователя.
   * @returns User - Найденный пользователь.
   */
  async getUser(id: number): Promise<User> {
    return await this.usersRepository.findOne({
      where: { id },
      include: { all: true },
    });
  }

  /**
   * Получить пользователя по Email.
   * @param {string} email - Email пользователя.
   * @returns User - Найденный пользователь.
   */
  async getUserByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { email },
      include: { all: true },
    });

    return user;
  }

  /**
   * Добавить роль пользователю.
   * @param {AddRoleDto} dto - DTO для добавления роли.
   * @returns AddRoleDto - Данные роли.
   */
  async addROle(dto: AddRoleDto): Promise<AddRoleDto> {
    const user = await this.getUser(dto.userId);
    const role = await this.roleService.getRoleByValue(dto.value);

    if (role && user) {
      await user.$add('role', role.id);

      return dto;
    }

    throw new RpcException(
      new NotFoundException('Пользователь или роль не найдены'),
    );
  }

  /**
   * Удалить роль пользователю.
   * @param {AddRoleDto} dto - DTO для добавления роли.
   * @returns AddRoleDto - Данные роли.
   */
  async removeRole(dto: AddRoleDto): Promise<AddRoleDto> {
    const user = await this.getUser(dto.userId);
    const role = await this.roleService.getRoleByValue(dto.value);

    if (role && user) {
      await user.$remove('role', role.id);

      return dto;
    }

    throw new RpcException(
      new NotFoundException('Пользователь или роль не найдены'),
    );
  }

  /**
   * Обновить refreshToken у пользователя.
   * @param {number} user_id - Идентификатор пользователя.
   * @param {string} hashToken - Захешированный новый refreshToken
   * @throws RpcException(NotFoundException)
   */
  async updateRefreshToken(user_id: number, hashToken: string): Promise<any> {
    const user = await this.usersRepository.findByPk(user_id);

    if (!user) {
      throw new RpcException(new NotFoundException('Пользователь не найден'));
    }

    user.refreshToken = hashToken;
    await user.save();
  }

  /**
   * Удалить refreshToken у пользователя.
   * @param {number} user_id - Идентификатор пользователя.
   * @throws RpcException(NotFoundException)
   */
  async removeRefreshToken(user_id: number): Promise<any> {
    const user = await this.usersRepository.findByPk(user_id);

    if (!user) {
      throw new RpcException(new NotFoundException('Пользователь не найден'));
    }

    user.refreshToken = null;
    await user.save();
  }
}
