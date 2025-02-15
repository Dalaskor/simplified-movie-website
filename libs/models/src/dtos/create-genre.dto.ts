import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, ValidateIf } from 'class-validator';

export class CreateGenreDto {
  @ApiProperty({
    example: 'драма',
    description: 'Название жанра',
  })
  @IsString({ message: 'Должно быть строкой' })
  name: string;

  @ApiProperty({
    example: 'action',
    description: 'Название жанра на английском',
  })
  @IsString({ message: 'Должно быть строкой' })
  @ValidateIf((object, value) => value !== null)
  @IsOptional()
  name_en?: string | null;
}
