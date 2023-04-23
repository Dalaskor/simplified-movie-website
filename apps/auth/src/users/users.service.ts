import { ROLES } from '@app/common';
import { AddRoleDto, CreateUserDto, User } from '@app/models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User) private readonly usersRepository: typeof User,
        private roleService: RolesService,
    ) {}

    async createUser(dto: CreateUserDto) {
        const user = await this.usersRepository.create(dto);
        let role = await this.roleService.getRoleByValue(ROLES.USER);

        if (!role) {
            role = await this.roleService.create({ value: ROLES.USER });
        }

        await user.$set('roles', [role.id]);
        user.roles = [role];

        return user;
    }

    async createAdmin(dto: CreateUserDto) {
        const user = await this.createUser(dto);
        let role = await this.roleService.getRoleByValue(ROLES.ADMIN);

        if (!role) {
            role = await this.roleService.create({ value: ROLES.ADMIN });
        }

        await user.$add('roles', [role.id]);
        user.roles.push(role);

        return user;
    }

    async getAllUsers() {
        const users = await this.usersRepository.findAll({
            include: { all: true },
        });

        return users;
    }

    async getUser(id: number) {
        return await this.usersRepository.findOne({
            where: { id },
            include: { all: true },
        });
    }

    async getUserByEmail(email: string) {
        const user = await this.usersRepository.findOne({
            where: { email },
            include: { all: true },
        });

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
