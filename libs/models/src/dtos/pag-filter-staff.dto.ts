import { STAFF_TYPES } from '@app/common';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { PageOptionsDto } from './page-options.dto';

export class StaffPagFilter extends PageOptionsDto {
  @ApiPropertyOptional({
    enum: STAFF_TYPES,
    description: 'Сортировка по типу участника',
  })
  @IsEnum(STAFF_TYPES)
  @IsOptional()
  readonly type?: STAFF_TYPES;

  @ApiPropertyOptional({
    type: String,
    description: 'Поиск по имени участника',
  })
  @IsOptional()
  readonly search?: String;
}
