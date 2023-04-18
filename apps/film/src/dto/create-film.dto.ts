import { Type } from "class-transformer";

export class CreateFilmDto {
    name: string;
    name_en: string;
    type: string;
    year: string;
    country: string[];
    genre: string[];
    tagline: string;
    director: string[];
    scenario: string[];
    producer: string[];
    operator: string[];
    compositor: string[];
    artist: string[];
    montage: string[];
    budget: string;
    feesUS: string;
    feesRU: string;
    fees: string;
    premiereRU: string;
    premiere: string;
    releaseDVD: string;
    releaseBluRay: string;
    age: string;
    ratingMPAA: string;
    time: string;
    description: string;
    mainImg: string;
    actors: string[];

    @Type(() => Spectator)
    spectators: Spectator[];
}

class Spectator {
    country: string;
    count: string;
}