import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateRoleDto, Role } from '@app/models';

@Injectable()
export class RolesService {
    constructor(@InjectModel(Role) private roleRepository: typeof Role) {}

    async create(dto: CreateRoleDto) {
        const role = await this.roleRepository.create(dto);

        return role;
    }

    async getAllRoles() {
        const roles = this.roleRepository.findAll();

        return roles;
    }

    async getRoleByValue(value: string) {
        const role = await this.roleRepository.findOne({ where: { value } });

        return role;
    }
}
