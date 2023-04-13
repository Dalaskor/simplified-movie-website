import { FilmSpectators } from 'apps/film/src/film-spectator.model';
import {
    FilmActors,
    FilmArtists,
    FilmCompositors,
    FilmDirectors,
    FilmMontages,
    FilmOperators,
} from 'apps/film/src/film-staff.model';
import { Film } from 'apps/film/src/film.model';
import { FilmGenres } from 'apps/genre/src/film-genres.model';
import {
    BelongsToMany,
    Column,
    DataType,
    Model,
    Table,
} from 'sequelize-typescript';

interface StaffCreationsAttrs {
    name: string;
}

@Table({ tableName: 'staffs' })
export class Staff extends Model<Staff, StaffCreationsAttrs> {
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false,
    })
    name: string;

    // @BelongsToMany(() => Film, () => FilmActors)
    // filmActors: Film[];

    // @BelongsToMany(() => Film, () => FilmMontages)
    // filmMontages: Film[];

    // @BelongsToMany(() => Film, () => FilmDirectors)
    // filmDirectors: Film[];

    // @BelongsToMany(() => Film, () => FilmArtists)
    // filmArtist: Film[];

    // @BelongsToMany(() => Film, () => FilmCompositors)
    // filmCompositors: Film[];

    // @BelongsToMany(() => Film, () => FilmOperators)
    // filmOperators: Film[];
}
