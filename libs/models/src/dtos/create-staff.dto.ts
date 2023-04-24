import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateStaffDto {
    @ApiProperty({
        example: 'Иван Иванов',
        description: 'Имя участника',
    })
    @IsString({ message: 'Должно быть строкой' })
    name: string;

    @ApiPropertyOptional({
        example: ['actor'],
        description: 'Тип участника (Может быть несколько)',
        isArray: true,
    })
    @IsOptional()
    @IsString({ each: true, message: 'Должно быть строкой' })
    types?: string[] = [];
}
