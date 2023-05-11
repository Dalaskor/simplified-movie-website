import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, ValidateIf } from 'class-validator';
import { CreateGenreDto } from './create-genre.dto';

export class UpdateGenreDto extends PartialType(CreateGenreDto) {
  @ApiProperty({
    example: '1',
    description: 'Идентификатор жанра в базе данных',
  })
  @IsInt({ message: 'id Должно быть целым числом' })
  id: number;

  @ApiProperty({
    example: 'драма',
    description: 'Название жанра',
  })
  @IsOptional()
  @IsString({ message: 'name Должно быть строкой' })
  name?: string;

  @ApiProperty({
    example: 'action',
    description: 'Название жанра на английском',
  })
  @IsOptional()
  @IsString({ message: 'name_en Должно быть строкой' })
  @ValidateIf((object, value) => value !== null)
  name_en?: string;
}
