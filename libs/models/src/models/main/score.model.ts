import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface ScoreCreationsAttrs {
  value: number;
  user_id: number;
}

@Table({ tableName: 'score' })
export class Score extends Model<Score, ScoreCreationsAttrs> {
  @ApiProperty({
    example: 1,
    description: 'ID оценки',
  })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: 7.5,
    description: 'Значение оценки',
  })
  @Column({ type: DataType.FLOAT, allowNull: false })
  value: number;

  @ApiProperty({
    example: 1,
    description: 'ID пользователя, который поставил оценку',
  })
  @Column({ type: DataType.INTEGER, allowNull: false })
  user_id: number;

  @ApiProperty({
    example: 1,
    description: 'ID фильма, на который поставили оценку',
  })
  @Column({ type: DataType.INTEGER, allowNull: false })
  film_id: number;
}
