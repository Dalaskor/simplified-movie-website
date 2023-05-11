import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Film } from './film.model';
import { Score } from './score.model';

@Table({ tableName: 'film_scores', createdAt: false, updatedAt: false })
export class FilmScores extends Model<FilmScores> {
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

  @ForeignKey(() => Score)
  @Column({ type: DataType.INTEGER })
  scoreId: number;
}
