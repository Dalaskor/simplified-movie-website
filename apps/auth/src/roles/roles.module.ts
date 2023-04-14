import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from './roles.model';
import { DatabaseModule } from '@app/common';
import { User } from '../users/users.model';
import { UserRoles } from '../user-roles/user-roles.model';

@Module({
    imports: [
        DatabaseModule,
        SequelizeModule.forFeature([Role, User, UserRoles]),
    ],
    providers: [RolesService],
    controllers: [RolesController],
    exports: [RolesService],
})
export class RolesModule {}
