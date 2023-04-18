import { Film } from 'apps/film/src/film.model';
import { BelongsToMany, Column, DataType, Model, Table } from 'sequelize-typescript';
import { FilmGenres } from './film-genres.model';

interface GenreCreationAttrs {
    name: string;
}

@Table({ tableName: 'genres' })
export class Genre extends Model<Genre, GenreCreationAttrs> {
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    name: string;

    @BelongsToMany(() => Film, () => FilmGenres)
    films: Film[];
}
