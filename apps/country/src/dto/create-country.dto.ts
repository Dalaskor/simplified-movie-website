import { IsString } from "class-validator";

export class CreateCountryDto {
    @IsString({ message: 'Должно быть строкой' })
    name: string;
}