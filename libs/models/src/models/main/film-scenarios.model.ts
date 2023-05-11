import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Film } from './film.model';
import { Staff } from './staff.model';

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
  @Column({ type: DataType.INTEGER })
  filmId: number;

  @ForeignKey(() => Staff)
  @Column({ type: DataType.INTEGER })
  staffId: number;
}
