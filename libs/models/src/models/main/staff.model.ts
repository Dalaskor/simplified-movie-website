import {
    BelongsToMany,
    Column,
    DataType,
    Model,
    Table,
} from 'sequelize-typescript';
import { StaffStaffTypes } from './staff-staff-types.model';
import { StaffType } from './staff-type.model';

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

    @BelongsToMany(() => StaffType, () => StaffStaffTypes)
    types: StaffType[];
}
