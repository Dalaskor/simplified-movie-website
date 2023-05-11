import { CreateUserDto } from '@app/models';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller()
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
