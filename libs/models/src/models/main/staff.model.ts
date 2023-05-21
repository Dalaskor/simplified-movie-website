import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    example: 1,
    description: 'ID участника фильма',
  })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: "Райан Гослинг",
    description: 'Имя участника фильма',
  })
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  name: string;

  @ApiProperty({
    example: "Что-то делал",
    description: 'Биография участника фильма',
  })
  @Column({
    type: DataType.TEXT,
    defaultValue: BiographyFill,
    allowNull: true,
  })
  biography: string;

  @BelongsToMany(() => StaffType, () => StaffStaffTypes)
  types: StaffType[];
}
