import { Order, SORT_PARAMS } from '@app/common';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { PageOptionsDto } from './page-options.dto';

export class FilmPagFilterDto extends PageOptionsDto {
  @ApiPropertyOptional({
    enum: SORT_PARAMS,
    default: SORT_PARAMS.rating,
    description: 'Фильтр для сортировки',
  })
  @IsEnum(SORT_PARAMS)
  @IsOptional()
  readonly orderBy?: SORT_PARAMS = SORT_PARAMS.rating;

  @ApiPropertyOptional({
    example: Order.ASC,
    description: 'Параметр для сортировки',
  })
  @IsEnum(Order)
  @IsOptional()
  readonly order?: Order = Order.ASC;

  @ApiPropertyOptional({
    default: [],
    example: ['биография', 'комедия'],
    description: 'Фильтр по списку жанров',
  })
  @Type(() => Array<string>)
  @IsOptional()
  readonly genres?: string[] = [];

  @ApiPropertyOptional({
    default: [],
    example: ['action', 'comedy'],
    description: 'Фильтр по списку жанров на английском',
  })
  @Type(() => Array<string>)
  @IsOptional()
  readonly genres_en?: string[] = [];

  @ApiPropertyOptional({
    default: [],
    example: ['Россия'],
    description: 'Фильтр по списку стран',
  })
  @Type(() => Array<string>)
  @IsOptional()
  readonly countries?: string[] = [];

  @ApiPropertyOptional({
    default: [],
    example: ['Райан Гослинг'],
    description: 'Фильтр по списку актеров',
  })
  @Type(() => Array<string>)
  @IsOptional()
  readonly actors?: string[] = [];

  @ApiPropertyOptional({
    default: [],
    example: ['Квентин Тарантино'],
    description: 'Фильтр по списку режисеров',
  })
  @Type(() => Array<string>)
  @IsOptional()
  readonly directors?: string[] = [];

  @ApiPropertyOptional({
    minimum: 0,
    default: 0,
    description: 'Минимальная оценка фильма',
  })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  readonly minCountScore?: number = 0;

  @ApiPropertyOptional({
    minimum: 1,
    description: 'Максимальная оценка фильма',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly maxCountScore?: number;

  @ApiPropertyOptional({
    minimum: 0,
    default: 0,
    description: 'Фильтр по году выпуска (начиная с)',
  })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  readonly yearStart?: number = 0;

  @ApiPropertyOptional({
    minimum: 1,
    description: 'Фильтр по году выпуска (до)',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly yearEnd?: number;

  @ApiPropertyOptional({
    minimum: 0,
    maximum: 9,
    default: 0,
    description: 'Фильтр по рейтингу (начиная с)',
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(9)
  @IsOptional()
  readonly ratingStart?: number = 0;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 10,
    default: 10,
    description: 'Фильтр по рейтингу (до)',
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(10)
  @IsNumber()
  readonly ratingEnd?: number;
}
