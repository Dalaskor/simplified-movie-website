import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface CountryCreationAttrs {
  name: string;
}

@Table({ tableName: 'countries' })
export class Country extends Model<Country, CountryCreationAttrs> {
  @ApiProperty({
    example: 1,
    description: 'ID страны',
  })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: 'Россия',
    description: 'Название страны',
  })
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  name: string;

  @Column({ type: DataType.INTEGER, unique: true })
  fk_countryid: number;
}
