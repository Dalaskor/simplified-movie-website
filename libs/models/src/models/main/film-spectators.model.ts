import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Film } from './film.model';
import { Spectators } from './spectators.model';

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
