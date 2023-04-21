import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class AddRoleDto {
    @ApiProperty({
        example: 'admin',
        description: 'Название существующей роли',
    })
    @IsString({ message: 'Должно быть строкой' })
    readonly value: string;

    @ApiProperty({
        example: '1',
        description: 'Идентификатор пользователя',
    })
    @IsNumber({}, { message: 'Должно быть числом' })
    readonly userId: number;
}
