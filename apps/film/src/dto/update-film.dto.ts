import { PartialType } from '@nestjs/mapped-types';
import { IsNumber } from 'class-validator';
import { CreateFilmDto } from './create-film.dto';

export class UpdateFilmDto extends PartialType(CreateFilmDto) {
    @IsNumber({}, {message: 'Должно быть целым числом'})
    id: number;
}