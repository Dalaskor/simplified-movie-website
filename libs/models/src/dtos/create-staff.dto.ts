import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, ValidateIf } from 'class-validator';

const BiographyFill: string =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras rhoncus lorem turpis, in vehicula augue mattis ut. Vestibulum convallis felis.';

export class CreateStaffDto {
  @ApiProperty({
    example: 'Иван Иванов',
    description: 'Имя участника',
  })
  @IsString({ message: 'name - должно быть строкой' })
  name: string;

  @ApiProperty({
    example: 'lorem ipsum',
    description:
      'Биография участника (Опционально, имеет по умолчанию значение в виде lorem ipusm)',
    default: BiographyFill,
  })
  @IsString({ message: 'biography - должно быть строкой' })
  @ValidateIf((object, value) => value !== null)
  biography?: string;

  @ApiPropertyOptional({
    example: 'actor',
    description: 'Тип участника (Может быть несколько)',
    isArray: true,
  })
  @IsOptional()
  @IsString({ each: true, message: 'Должно быть строкой' })
  types: string[] = [];
}
