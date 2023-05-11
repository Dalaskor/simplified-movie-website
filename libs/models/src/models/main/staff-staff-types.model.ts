import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { StaffType } from './staff-type.model';
import { Staff } from './staff.model';

@Table({ tableName: 'staff_stafftypes', createdAt: false, updatedAt: false })
export class StaffStaffTypes extends Model<StaffStaffTypes> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => Staff)
  @Column({ type: DataType.INTEGER })
  staffId: number;

  @ForeignKey(() => StaffType)
  @Column({ type: DataType.INTEGER })
  stafftypeId: number;
}
