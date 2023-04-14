import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { USER_ROLES } from 'apps/auth/constants/roles';
import { RolesService } from '../roles/roles.service';
import { AddRoleDto } from './dto/add-role.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.model';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User) private readonly usersRepository: typeof User,
        private roleService: RolesService,
    ) {}

    async createUser(dto: CreateUserDto) {
        const user = await this.usersRepository.create(dto);
        let role = await this.roleService.getRoleByValue(USER_ROLES.USER);

        if (!role) {
            role = await this.roleService.create({ value: USER_ROLES.USER });
        }

        await user.$set('roles', [role.id]);
        user.roles = [role];

        await user.save();

        return user;
    }

    async getAllUsers() {
        const users = await this.usersRepository.findAll({
            include: { all: true },
        });

        return users;
    }

    async getUser(id: number) {
        return await this.usersRepository.findOne({ where: { id } });
    }

    async getUserByEmail(email: string) {
        const user = await this.usersRepository.findOne({ where: { email } });

        return user;
    }

    async addROle(dto: AddRoleDto) {
        const user = await this.getUser(dto.userId);
        const role = await this.roleService.getRoleByValue(dto.value);

        if (role && user) {
            await user.$add('role', role.id);

            return dto;
        }

        throw new HttpException(
            'Пользователь или роль не найдены',
            HttpStatus.NOT_FOUND,
        );
    }

    async removeRole(dto: AddRoleDto) {
        const user = await this.getUser(dto.userId);
        const role = await this.roleService.getRoleByValue(dto.value);

        if (role && user) {
            await user.$remove('role', role.id);

            return dto;
        }

        throw new HttpException(
            'Пользователь или роль не найдены',
            HttpStatus.NOT_FOUND,
        );
    }
}
