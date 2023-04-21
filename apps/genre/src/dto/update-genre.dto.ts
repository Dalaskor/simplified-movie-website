import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { CreateGenreDto } from './create-genre.dto';

export class UpdateGenreDto extends PartialType(CreateGenreDto) {
    @ApiProperty({
        example: "1",
        description: "Идентификатор жанра в базе данных"
    })
    @IsNumber({}, { message: 'Должно быть целым числом' })
    id: number;

    @ApiProperty({
        example: "драма",
        description: "Название жанра"
    })
    @IsString({ message: 'Должно быть строкой' })
    name: string;
}