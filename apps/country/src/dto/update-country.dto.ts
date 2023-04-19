import { PartialType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';
import { CreateCountryDto } from './create-country.dto';

export class UpdateCountryDto extends PartialType(CreateCountryDto) {
    @IsString({ message: 'Должно быть строкой' })
    id: number;
}