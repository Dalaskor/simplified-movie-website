import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, Max, Min } from 'class-validator';

export class CreateScoreDto {
  @ApiProperty({
    example: '7.5',
    description: 'Оценка фильма от 0 до 10',
  })
  @Max(10)
  @Min(0)
  @IsNumber({}, { message: 'Должно быть числом' })
  value: number;

  @ApiProperty({
    example: '1',
    description: 'Идентификатор пользователя',
  })
  @IsInt({ message: 'Должно быть целым числом' })
  user_id: number;

  @ApiProperty({
    example: '1',
    description: 'Идентификатор фильма',
  })
  @IsInt({ message: 'Должно быть целым числом' })
  film_id: number;
}
