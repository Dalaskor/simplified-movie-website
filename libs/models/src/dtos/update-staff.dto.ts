import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { CreateStaffDto } from './create-staff.dto';

export class UpdateStaffDto extends PartialType(CreateStaffDto) {
    @ApiProperty({
        example: 1,
        description: 'Идентификатор участника в базе данных',
    })
    @IsNumber({}, { message: 'Должно быть целым числом' })
    id: number;

    @ApiProperty({
        example: 'Иван Иванов',
        description: 'Имя участника',
    })
    @IsNumber({}, { message: 'Должно быть целым числом' })
    name: string;
}
