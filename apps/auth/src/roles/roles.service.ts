import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateRoleDto, Role } from '@app/models';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role) private roleRepository: typeof Role) {}

  /**
   * Создать роль.
   * @param {CreateRoleDto} dto - DTO для создания роли.
   * @returns Role - Созданная роль.
   * @throws BadRequetException
   */
  async create(dto: CreateRoleDto): Promise<Role> {
    const candidate = await this.roleRepository.findOne({
      where: { value: dto.value },
    });

    if (candidate) {
      throw new RpcException(
        new BadRequestException('Такая роль уже существует'),
      );
    }

    const role = await this.roleRepository.create(dto);

    return role;
  }

  /**
   * Получить список всех ролей.
   * @returns Roles[] - Список найденных ролей.
   */
  async getAllRoles(): Promise<Role[]> {
    const roles = this.roleRepository.findAll();

    return roles;
  }

  /**
   * Получить роль по названию.
   * @param {string} value - Название роли.
   * @returns Role - Найденная роль.
   */
  async getRoleByValue(value: string): Promise<Role> {
    const role = await this.roleRepository.findOne({ where: { value } });

    return role;
  }
}
