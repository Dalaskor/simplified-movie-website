import { DatabaseModule, RmqModule } from '@app/common';
import { Staff, StaffStaffTypes } from '@app/models';
import { StaffType } from '@app/models/models/main/staff-type.model';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import * as Joi from 'joi';
import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_STAFF_QUEUE: Joi.string().required(),
        POSTGRES_URI: Joi.string().required(),
      }),
      envFilePath: './apps/staff/.env',
    }),
    DatabaseModule,
    SequelizeModule.forFeature([Staff, StaffType, StaffStaffTypes]),
    RmqModule,
  ],
  controllers: [StaffController],
  providers: [StaffService],
})
export class StaffModule {}
