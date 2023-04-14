import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.model';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User) private readonly usersRepository: typeof User,
    ) {}

    async createUser(dto: CreateUserDto) {
        const user = await this.usersRepository.create(dto);

        return user;
    }

    async getAllUsers() {
        const users = await this.usersRepository.findAll({
            include: { all: true },
        });

        return users;
    }

    async getUser(id: number) {
        return await this.usersRepository.findByPk(id);
    }

    async getUserByEmail(email: string) {
        const user = await this.usersRepository.findOne({ where: { email } });

        return user;
    }
}
