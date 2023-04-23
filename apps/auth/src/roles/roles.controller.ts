import { Controller} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateRoleDto } from '@app/models';
import { RolesService } from './roles.service';

@Controller()
export class RolesController {
    constructor(private roleService: RolesService) {}

    @MessagePattern('createRole')
    create(@Payload() roleDto: CreateRoleDto) {
        return this.roleService.create(roleDto);
    }

    @MessagePattern('getRoles')
    getAll() {
        return this.roleService.getAllRoles();
    }

    @MessagePattern('getRoleByValue')
    getByValue(@Payload('value') value: string) {
        return this.roleService.getRoleByValue(value);
    }
}
