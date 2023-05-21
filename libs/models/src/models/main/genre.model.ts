import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface GenreCreationAttrs {
  name: string;
}

@Table({ tableName: 'genres' })
export class Genre extends Model<Genre, GenreCreationAttrs> {
  @ApiProperty({
    example: 1,
    description: 'ID жанра',
  })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: 'комедия',
    description: 'Название жанра',
  })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  name: string;

  @ApiProperty({
    example: 'comedy',
    description: 'Название жанра на английском',
  })
  @Column({ type: DataType.STRING, unique: true, allowNull: true })
  name_en: string;
}
