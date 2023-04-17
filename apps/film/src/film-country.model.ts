import { Country } from 'apps/country/src/country.model';
import {
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from 'sequelize-typescript';
import { Film } from './film.model';

@Table({ tableName: 'film_countries', createdAt: false, updatedAt: false })
export class FilmCountries extends Model<FilmCountries> {
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ForeignKey(() => Film)
    @Column({ type: DataType.INTEGER })
    filmId: number;

    @ForeignKey(() => Country)
    @Column({ type: DataType.INTEGER })
    countryId: number;
}
