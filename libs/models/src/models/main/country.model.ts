import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface CountryCreationAttrs {
  name: string;
}

@Table({ tableName: 'countries' })
export class Country extends Model<Country, CountryCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  name: string;

  @Column({ type: DataType.INTEGER, unique: true })
  fk_countryid: number;
}
