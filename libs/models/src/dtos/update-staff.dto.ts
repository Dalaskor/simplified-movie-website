import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, ValidateIf } from 'class-validator';
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

  @ApiProperty({
    example: 'lorem ipsum',
    description:
      'Биография участника (Опционально, имеет по умолчанию значение в виде lorem ipusm)',
  })
  @IsString({ message: 'biography - должно быть строкой' })
  @ValidateIf((object, value) => value !== null)
  biography?: string;

  @ApiPropertyOptional({
    example: ['actor'],
    description: 'Тип участника (Может быть несколько)',
    isArray: true,
  })
  @IsOptional()
  @IsString({
    each: true,
    message: 'элемент массива types должен быть строкой',
  })
  types: string[] = [];
}
