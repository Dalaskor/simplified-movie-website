import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { StaffStaffTypes } from './staff-staff-types.model';
import { StaffType } from './staff-type.model';

const BiographyFill: string =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras rhoncus lorem turpis, in vehicula augue mattis ut. Vestibulum convallis felis.';

interface StaffCreationsAttrs {
  name: string;
}

@Table({ tableName: 'staffs' })
export class Staff extends Model<Staff, StaffCreationsAttrs> {
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

  @Column({
    type: DataType.TEXT,
    defaultValue: BiographyFill,
    allowNull: true,
  })
  biography: string;

  @BelongsToMany(() => StaffType, () => StaffStaffTypes)
  types: StaffType[];
}
