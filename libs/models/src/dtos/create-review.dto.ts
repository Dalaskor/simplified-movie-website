import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class CreateReviewDto {
    @ApiProperty({
        example: 'Lorem ipsum',
        description: 'Текст отзыва',
    })
    @IsString({ message: 'Должно быть строкой' })
    text: string;

    @ApiProperty({
        example: 1,
        description: 'ID пользователя, который написал отзыв',
    })
    @IsInt({ message: 'Должно быть целым числом' })
    user_id: number;

    @ApiProperty({
        example: 1,
        description: 'ID фильма на который написали отзыв',
    })
    @IsInt({ message: 'Должно быть целым числом' })
    film_id: number;
}
