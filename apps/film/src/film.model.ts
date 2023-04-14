import { Country } from 'apps/country/src/country.model';
import { FilmGenres } from 'apps/genre/src/film-genres.model';
import { Genre } from 'apps/genre/src/genre.model';
import { Staff } from 'apps/staff/src/staff.model';
import {
    BelongsToMany,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from 'sequelize-typescript';
import { FilmSpectators } from './film-spectator.model';
import {
    FilmActors,
    FilmArtists,
    FilmCompositors,
    FilmDirectors,
    FilmMontages,
    FilmOperators,
} from './film-staff.model';

interface FilmCreationAttrs {
    name: string;
    name_en: string;
    img_url: string;
    year: number;
    tagline: string;
    budget: string;
    fees_us: string;
    fees_ru: string;
    fees: string;
    premiere: string;
    premiere_ru: string;
    release_dvd: string;
    release_bluray: string;
    age: string;
    rating_mpaa: string;
}

@Table({ tableName: 'films' })
export class Film extends Model<Film, FilmCreationAttrs> {
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name: string;

    @Column({
        type: DataType.STRING,
    })
    name_en: string;

    @Column({
        type: DataType.STRING,
    })
    img_url: string;

    @Column({
        type: DataType.INTEGER,
    })
    year: number;

    @Column({
        type: DataType.TEXT,
    })
    tagline: string;

    @Column({
        type: DataType.STRING,
    })
    budget: string;

    @Column({
        type: DataType.STRING,
    })
    fees: string;

    @Column({
        type: DataType.STRING,
    })
    fees_us: string;

    @Column({
        type: DataType.STRING,
    })
    fees_ru: string;

    @Column({
        type: DataType.STRING,
    })
    premiere: string;

    @Column({
        type: DataType.STRING,
    })
    premiere_ru: string;

    @Column({
        type: DataType.STRING,
    })
    release_dvd: string;

    @Column({
        type: DataType.STRING,
    })
    release_bluray: string;

    @Column({
        type: DataType.STRING,
    })
    age: string;

    @Column({
        type: DataType.STRING,
    })
    rating_mpaa: string;

    @ForeignKey(() => Country)
    @Column({ type: DataType.INTEGER })
    country_id: number;

    @BelongsToMany(() => Genre, () => FilmGenres)
    genres: Genre[];

    @BelongsToMany(() => Staff, () => FilmOperators)
    operators: Staff[];

    @BelongsToMany(() => Staff, () => FilmCompositors)
    compositors: Staff[];

    @BelongsToMany(() => Staff, () => FilmActors)
    actors: Staff[];

    @BelongsToMany(() => Staff, () => FilmArtists)
    artists: Staff[];

    @BelongsToMany(() => Staff, () => FilmDirectors)
    directors: Staff[];

    @BelongsToMany(() => Staff, () => FilmMontages)
    montages: Staff[];

    @BelongsToMany(() => Country, () => FilmSpectators)
    spectators: Country[];
}
