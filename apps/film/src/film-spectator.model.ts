import { Country } from 'apps/country/src/country.model';
import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    HasOne,
    Model,
    Table,
} from 'sequelize-typescript';
import { Film } from './film.model';

interface SpectatorCreationAttrs {
    count: string;
}

@Table({ tableName: 'spectators', createdAt: false, updatedAt: false })
export class Spectators extends Model<Spectators, SpectatorCreationAttrs> {
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @HasOne(() => Country, 'fk_countryid')
    country: Country;

    @Column({ type: DataType.STRING })
    count: string;
}

@Table({ tableName: 'film_spectators', createdAt: false, updatedAt: false })
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
