import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class DeleteScoreDto {
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
