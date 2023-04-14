import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './roles.model';

@Injectable()
export class RolesService {
    constructor(@InjectModel(Role) private roleRepository: typeof Role) {}

    async create(dto: CreateRoleDto) {
        const role = await this.roleRepository.create(dto);

        return role;
    }

    async getAllRoles() {
        const roles = this.roleRepository.findAll({ include: { all: true } });

        return roles;
    }

    async getRoleByValue(value: string) {
        const role = await this.roleRepository.findOne({ where: { value } });

        if (!role) {
            throw new HttpException('Роль не найдена', HttpStatus.NOT_FOUND);
        }

        return role;
    }
}
