import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface FilmCreationAttrs {
    name: string,
    img_url: string,
    year: number,
    tagline: string,
    budget: string,
    fees_us: string,
    fees_ru: string,
    fees: string,
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
}
