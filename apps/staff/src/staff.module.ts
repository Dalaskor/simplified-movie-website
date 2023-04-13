import { DatabaseModule } from '@app/common';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { StaffController } from './staff.controller';
import { Staff } from './staff.model';
import { StaffService } from './staff.service';

@Module({
  imports: [
      DatabaseModule,
      SequelizeModule.forFeature([Staff])
  ],
  controllers: [StaffController],
  providers: [StaffService],
})
export class StaffModule {}
