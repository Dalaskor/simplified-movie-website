import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';
import { CreateCountryDto } from './create-country.dto';

export class UpdateCountryDto extends PartialType(CreateCountryDto) {
    @ApiProperty({
        example: 1,
        description: 'Идентификатор страны в базе данных',
    })
    @IsInt({ message: 'Должно быть целым числом' })
    id: number;

    @ApiProperty({
        example: 'Россия',
        description: 'Название страны',
    })
    @IsString({ message: 'Должно быть строкой' })
    name: string;
}
