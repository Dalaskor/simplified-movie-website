import { IsString } from "class-validator";

export class CreateSpectatorDto {
    @IsString({ message: 'Должно быть строкой' })
    count: string;

    @IsString({ message: 'Должно быть строкой' })
    country: string;
}
