import { BelongsToMany, Column, DataType, Model, Table } from 'sequelize-typescript';
import { UserRoles } from '../user-roles/user-roles.model';
import { User } from '../users/users.model';

interface RolesCreationAttrs {
    value: string;
}

@Table({ tableName: 'roles' })
export class Role extends Model<Role, RolesCreationAttrs> {
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    value: string;

    @BelongsToMany(() => User, () => UserRoles)
    users: User[];
}
