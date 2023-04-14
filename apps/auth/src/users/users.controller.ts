import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    async createUser(@Body() userDto: CreateUserDto) {
        return await this.usersService.createUser(userDto);
    }

    @Get()
    async getAllUsers() {
        return await this.usersService.getAllUsers();
    }
}
