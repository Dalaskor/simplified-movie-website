import { DatabaseModule } from '@app/common';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from '../roles/roles.model';
import { RolesModule } from '../roles/roles.module';
import { UserRoles } from '../user-roles/user-roles.model';
import { UsersController } from './users.controller';
import { User } from './users.model';
import { UsersService } from './users.service';

@Module({
    imports: [
        DatabaseModule,
        SequelizeModule.forFeature([User, Role, UserRoles]),
        RolesModule,
    ],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
})
export class UserModule {}
