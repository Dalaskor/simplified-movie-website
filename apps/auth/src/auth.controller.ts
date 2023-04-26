import { RmqService } from '@app/common';
import { Controller } from '@nestjs/common';
import {
    Ctx,
    MessagePattern,
    Payload,
    RmqContext,
} from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { AddRoleDto, CreateUserDto, Role } from '@app/models';

@Controller()
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly rmqService: RmqService,
    ) {}

    @MessagePattern('registration')
    async registration(@Payload() dto: CreateUserDto) {
        return await this.authService.registration(dto);
    }

    @MessagePattern('login')
    async login(@Payload() dto: CreateUserDto) {
        return await this.authService.login(dto);
    }

    @MessagePattern('validate_user')
    async handleValidateUser(@Payload() data: any, @Ctx() context: RmqContext) {
        this.rmqService.ack(context);
        return await this.authService.handleValidateUser(data);
    }

    @MessagePattern('validate_user_with_roles')
    async handleValidateUserWithRoles(
        @Payload() data: any,
        @Ctx() context: RmqContext,
    ) {
        this.rmqService.ack(context);
        return await this.authService.handleValidateUserWithRoles(data);
    }

    @MessagePattern('createSuperUser')
    async createSuperUser(@Payload() dto: CreateUserDto) {
        return await this.authService.createSuperUser(dto);
    }

    @MessagePattern('getUser')
    async getUser(@Payload() id: number) {
        return await this.authService.getUser(id);
    }

    @MessagePattern('googleAuthRedirect')
    async googleAuthRedirect(@Payload() user: any) {
        return await this.authService.googleLogin(user);
    }

    @MessagePattern('loginByVk')
    async vkLogin(@Payload() query: any) {
        return await this.authService.vkLogin(query);
    }

    @MessagePattern('checkUserEmail')
    async checkUserEmail(@Payload() email: string) {
        return await this.authService.checkUserEmail(email);
    }

    @MessagePattern('userAddRole')
    async userAddRole(@Payload() dto: AddRoleDto): Promise<AddRoleDto> {
        return await this.authService.userAddRole(dto);
    }

    @MessagePattern('userRemoveRole')
    async userRemoveRole(@Payload() dto: AddRoleDto): Promise<AddRoleDto> {
        return await this.authService.userRemoveRole(dto);
    }

    @MessagePattern('getAllRoles')
    async getAllRoles(): Promise<Role[]> {
        return await this.authService.getAllRoles();
    }
}
