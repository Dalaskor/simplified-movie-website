import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface ReviewCreationsAttrs {
  value: number;
}

@Table({ tableName: 'review' })
export class Review extends Model<Review, ReviewCreationsAttrs> {
  @ApiProperty({
    example: 1,
    description: 'ID отзыва',
  })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: 'Lorem ipsum',
    description: 'Текст отзыва',
  })
  @Column({ type: DataType.TEXT, allowNull: false })
  text: string;

  @ApiProperty({
    example: 1,
    description: 'ID пользователя, который оставил отзыв',
  })
  @Column({ type: DataType.INTEGER, allowNull: false })
  user_id: number;

  @ApiProperty({
    example: 1,
    description: 'ID фильма, на который оставили отзыв',
  })
  @Column({ type: DataType.INTEGER, allowNull: false })
  film_id: number;

  @ApiProperty({
    example: 1,
    description: 'ID пользователя, которому ответили в отзывах',
  })
  @Column({ type: DataType.INTEGER, allowNull: true })
  parent: number;
}
