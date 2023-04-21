import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateStaffDto {
    @ApiProperty({
        example: 'Иван Иванов',
        description: 'Имя участника'
    })
    @IsNumber({}, { message: 'Должно быть целым числом' })
    name: string;
}