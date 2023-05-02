import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { CreateStaffDto } from './create-staff.dto';

export class UpdateStaffDto extends PartialType(CreateStaffDto) {
    @ApiProperty({
        example: 1,
        description: 'Идентификатор участника в базе данных',
    })
    @IsInt({ message: 'id Должно быть целым числом' })
    id: number;

    @ApiProperty({
        example: 'Иван Иванов',
        description: 'Имя участника',
    })
    @IsString({ message: 'name Должно быть строкой' })
    name: string;

    @ApiPropertyOptional({
        example: ['actor'],
        description: 'Тип участника (Может быть несколько)',
        isArray: true,
    })
    @IsOptional()
    @IsString({ each: true, message: 'элемент массива types Должно быть строкой' })
    types: string[] = [];
}
