import { IsString } from "class-validator";

export class CreateGenreDto {
    @IsString({ message: 'Должно быть строкой' })
    name: string;
}