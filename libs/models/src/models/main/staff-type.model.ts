import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { StaffStaffTypes } from './staff-staff-types.model';
import { Staff } from './staff.model';

interface StaffTypeCreationsAttrs {
  name: string;
}

@Table({ tableName: 'stafftype', timestamps: false, createdAt: false })
export class StaffType extends Model<StaffType, StaffTypeCreationsAttrs> {
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

  @BelongsToMany(() => Staff, () => StaffStaffTypes)
  staffs: Staff[];
}
