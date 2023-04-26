import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateRoleDto, Role } from '@app/models';
import { RolesService } from './roles.service';

@Controller()
export class RolesController {
    constructor(private roleService: RolesService) {}

    /**
     * Создать роль.
     * @param {CreateRoleDto} roleDto - DTO для создания роли.
     * @returns Role - Созданная роль.
     */
    @MessagePattern('createRole')
    async create(@Payload() roleDto: CreateRoleDto): Promise<Role> {
        return await this.roleService.create(roleDto);
    }

    /**
     * Получить список всех ролей.
     * @returns Roles[] - Список найденных ролей.
     */
    @MessagePattern('getRoles')
    async getAll(): Promise<Role[]> {
        return await this.roleService.getAllRoles();
    }

    /**
     * Получить роль по названию.
     * @param {string} value - Название роли.
     * @returns Role - Найденная роль.
     */
    @MessagePattern('getRoleByValue')
    async getByValue(@Payload('value') value: string): Promise<Role> {
        return await this.roleService.getRoleByValue(value);
    }
}
