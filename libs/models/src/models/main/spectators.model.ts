import { Column, DataType, HasOne, Model, Table } from 'sequelize-typescript';
import { Country } from './country.model';

interface SpectatorCreationAttrs {
  count: string;
}

@Table({ tableName: 'spectators', createdAt: false, updatedAt: false })
export class Spectators extends Model<Spectators, SpectatorCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @HasOne(() => Country, 'fk_countryid')
  country: Country;

  @Column({ type: DataType.STRING })
  count: string;
}
