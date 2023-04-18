import { Country } from 'apps/country/src/country.model';
import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from 'sequelize-typescript';
import { Film } from './film.model';

interface spectatorCreationAttrs {
    count: string;
}

@Table({ tableName: 'spectators', createdAt: false, updatedAt: false })
export class Spectators extends Model<Spectators, spectatorCreationAttrs> {
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @BelongsTo(() => Country, 'fk_countryid')
    country: Country

    @Column({ type: DataType.INTEGER })
    count: string;
}

@Table({tableName: 'film_spectators', createdAt: false, updatedAt: false})
export class FilmSpectators extends Model<FilmSpectators> {
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ForeignKey(() => Spectators)
    @Column({ type: DataType.INTEGER })
    spectatorId: number;

    @ForeignKey(() => Film)
    @Column({ type: DataType.INTEGER })
    filmId: number;
}
