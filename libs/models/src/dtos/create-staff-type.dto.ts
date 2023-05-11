import { STAFF_TYPES } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

export class CreateStaffTypeDto {
  @ApiProperty({
    enum: STAFF_TYPES,
    description: 'Тип участника',
  })
  @IsEnum(STAFF_TYPES)
  name: STAFF_TYPES;
}
