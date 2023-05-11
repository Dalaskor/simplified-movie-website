import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role, User, UserRoles } from '@app/models';
import { DatabaseModule } from '@app/common';

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
