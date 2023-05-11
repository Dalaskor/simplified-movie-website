import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface ScoreCreationsAttrs {
  value: number;
  user_id: number;
}

@Table({ tableName: 'score' })
export class Score extends Model<Score, ScoreCreationsAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.FLOAT, allowNull: false })
  value: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  user_id: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  film_id: number;
}
