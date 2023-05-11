import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class UpdateReviewDto {
  @ApiProperty({
    example: 1,
    description: 'ID комментария',
  })
  @IsInt({ message: 'id Должно быть целым числом' })
  id: number;

  @ApiProperty({
    example: 'Lorem ipsum',
    description: 'Текст отзыва',
  })
  @IsString({ message: 'text Должно быть строкой' })
  text: string;
}
