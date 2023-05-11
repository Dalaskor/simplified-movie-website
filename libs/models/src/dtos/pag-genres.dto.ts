import { GENRE_ORDERBY } from '@app/common';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { PageOptionsDto } from './page-options.dto';

export class GenrePag extends PageOptionsDto {
  @ApiPropertyOptional({
    enum: GENRE_ORDERBY,
    default: GENRE_ORDERBY.name,
    description: 'Фильтр для сортировки',
  })
  @IsEnum(GENRE_ORDERBY)
  @IsOptional()
  readonly orderBy?: GENRE_ORDERBY = GENRE_ORDERBY.name;
}
