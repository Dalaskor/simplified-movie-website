import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';

export class CreateFilmDto {
    @IsString({ message: 'Должно быть строкой' })
    name: string;

    @IsString({ message: 'Должно быть строкой' })
    name_en: string;

    @IsString({ message: 'Должно быть строкой' })
    type: string;

    @IsNumber({}, { message: 'Должно быть целым числом' })
    year: number;

    @IsString({ message: 'Должно быть строкой', each: true })
    country: string[];

    @IsString({ message: 'Должно быть строкой', each: true })
    genre: string[];

    @IsString({ message: 'Должно быть строкой' })
    tagline: string;

    @IsString({ message: 'Должно быть строкой', each: true })
    director: string[];

    @IsString({ message: 'Должно быть строкой', each: true })
    scenario: string[];

    @IsString({ message: 'Должно быть строкой', each: true })
    producer: string[];

    @IsString({ message: 'Должно быть строкой', each: true })
    operator: string[];

    @IsString({ message: 'Должно быть строкой', each: true })
    compositor: string[];

    @IsString({ message: 'Должно быть строкой', each: true })
    artist: string[];

    @IsString({ message: 'Должно быть строкой', each: true })
    montage: string[];

    @IsString({ message: 'Должно быть строкой' })
    budget: string;

    @IsString({ message: 'Должно быть строкой' })
    feesUS: string;

    @IsString({ message: 'Должно быть строкой' })
    feesRU: string;

    @IsString({ message: 'Должно быть строкой' })
    fees: string;

    @IsString({ message: 'Должно быть строкой' })
    premiereRU: string;

    @IsString({ message: 'Должно быть строкой' })
    premiere: string;

    @IsString({ message: 'Должно быть строкой' })
    releaseDVD: string;

    @IsString({ message: 'Должно быть строкой' })
    releaseBluRay: string;

    @IsString({ message: 'Должно быть строкой' })
    age: string;

    @IsString({ message: 'Должно быть строкой' })
    ratingMPAA: string;

    @IsString({ message: 'Должно быть строкой' })
    time: string;

    @IsString({ message: 'Должно быть строкой' })
    description: string;

    @IsString({ message: 'Должно быть строкой' })
    mainImg: string;

    actors: string[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Spectator)
    spectators: Spectator[];
}

class Spectator {
    country: string;
    count: string;
}