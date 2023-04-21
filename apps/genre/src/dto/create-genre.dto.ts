import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateGenreDto {
    @ApiProperty({
        example: "драма",
        description: "Название жанра"
    })
    @IsString({ message: 'Должно быть строкой' })
    name: string;
}