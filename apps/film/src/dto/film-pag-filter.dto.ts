import { PageOptionsDto } from '@app/common';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional } from 'class-validator';

export class FilmPagFilterDto extends PageOptionsDto {
    @ApiPropertyOptional({
        default: [],
        example: ['биография', 'комедия'],
        description: 'Фильтр по списку жанров',
    })
    @Type(() => Array<string>)
    @IsArray()
    @IsOptional()
    readonly genres?: string[] = [];

    @ApiPropertyOptional({
        default: [],
        example: ['action', 'comedy'],
        description: 'Фильтр по списку жанров на английском',
    })
    @Type(() => Array<string>)
    @IsArray()
    @IsOptional()
    readonly genres_en?: string[] = [];

    @ApiPropertyOptional({
        default: [],
        example: ['Россия'],
        description: 'Фильтр по списку стран',
    })
    @Type(() => Array<string>)
    @IsArray()
    @IsOptional()
    readonly countries?: string[] = [];

    @ApiPropertyOptional({
        default: [],
        example: ['Райан Гослинг'],
        description: 'Фильтр по списку актеров',
    })
    @Type(() => Array<string>)
    @IsArray()
    @IsOptional()
    readonly actors?: string[] = [];

    @ApiPropertyOptional({
        default: [],
        example: ['Квентин Тарантино'],
        description: 'Фильтр по списку режисеров',
    })
    @Type(() => Array<string>)
    @IsArray()
    @IsOptional()
    readonly directors?: string[] = [];
}
