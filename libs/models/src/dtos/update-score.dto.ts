import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber } from 'class-validator';

export class UpdateScoreDto {
  @ApiProperty({
    example: '1',
    description: 'Идентификатор фильма',
  })
  @IsInt({ message: 'film_id Должно быть целым числом' })
  film_id: number;

  @ApiProperty({
    example: '1',
    description: 'Идентификатор пользователя',
  })
  @IsInt({ message: 'user_id Должно быть целым числом' })
  user_id: number;

  @ApiProperty({
    example: '7.5',
    description: 'Оценка фильма',
  })
  @IsNumber({}, { message: 'value Должно быть числом' })
  value: number;
}
