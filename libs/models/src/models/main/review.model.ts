import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface ReviewCreationsAttrs {
  value: number;
}

@Table({ tableName: 'review' })
export class Review extends Model<Review, ReviewCreationsAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.TEXT, allowNull: false })
  text: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  user_id: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  film_id: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  parent: number;
}
