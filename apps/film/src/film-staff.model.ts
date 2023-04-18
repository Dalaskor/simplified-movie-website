import { Staff } from "apps/staff/src/staff.model";
import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Film } from "./film.model";

@Table({ tableName: 'film_operators', createdAt: false, updatedAt: false })
export class FilmOperators extends Model<FilmOperators> {
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ForeignKey(() => Film)
    @Column({type: DataType.INTEGER})
    filmId: number;

    @ForeignKey(() => Staff)
    @Column({type: DataType.INTEGER})
    staffId: number;
}

@Table({ tableName: 'film_compositors', createdAt: false, updatedAt: false })
export class FilmCompositors extends Model<FilmCompositors> {
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ForeignKey(() => Film)
    @Column({type: DataType.INTEGER})
    filmId: number;

    @ForeignKey(() => Staff)
    @Column({type: DataType.INTEGER})
    staffId: number;
}

@Table({ tableName: 'film_actors', createdAt: false, updatedAt: false })
export class FilmActors extends Model<FilmActors> {
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ForeignKey(() => Film)
    @Column({type: DataType.INTEGER})
    filmId: number;

    @ForeignKey(() => Staff)
    @Column({type: DataType.INTEGER})
    staffId: number;
}

@Table({ tableName: 'film_artists', createdAt: false, updatedAt: false })
export class FilmArtists extends Model<FilmArtists> {
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ForeignKey(() => Film)
    @Column({type: DataType.INTEGER})
    filmId: number;

    @ForeignKey(() => Staff)
    @Column({type: DataType.INTEGER})
    staffId: number;
}

@Table({ tableName: 'film_directors', createdAt: false, updatedAt: false })
export class FilmDirectors extends Model<FilmDirectors> {
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ForeignKey(() => Film)
    @Column({type: DataType.INTEGER})
    filmId: number;

    @ForeignKey(() => Staff)
    @Column({type: DataType.INTEGER})
    staffId: number;
}

@Table({ tableName: 'film_montages', createdAt: false, updatedAt: false })
export class FilmMontages extends Model<FilmMontages> {
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ForeignKey(() => Film)
    @Column({type: DataType.INTEGER})
    filmId: number;

    @ForeignKey(() => Staff)
    @Column({type: DataType.INTEGER})
    staffId: number;
}

@Table({ tableName: 'film_scenario', createdAt: false, updatedAt: false })
export class FilmScenario extends Model<FilmScenario> {
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ForeignKey(() => Film)
    @Column({type: DataType.INTEGER})
    filmId: number;

    @ForeignKey(() => Staff)
    @Column({type: DataType.INTEGER})
    staffId: number;
}
