import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { Staff } from './staff.model';

@Injectable()
export class StaffService {
    constructor(@InjectModel(Staff) private staffRepository: typeof Staff) {}

    async createMany(createStaffDtoArray: CreateStaffDto[]) {
        const staffs = await this.staffRepository.bulkCreate(
            createStaffDtoArray,
            { ignoreDuplicates: true },
        );

        return staffs;
    }

    async create(createStaffDto: CreateStaffDto) {
        const staff = await this.staffRepository.create(createStaffDto);

        return staff;
    }

    async findAll() {
        const staffs = await this.staffRepository.findAll({
            include: { all: true },
        });

        return staffs;
    }

    async findOne(id: number) {
        const staff = await this.staffRepository.findOne({ where: { id } });

        if (!staff) {
            throw new HttpException(
                'Участник фильма не найден',
                HttpStatus.NOT_FOUND,
            );
        }

        return staff;
    }

    async update(id: number, updateStaffDto: UpdateStaffDto) {
        const staff = await this.findOne(id);

        staff.name = updateStaffDto.name;

        await staff.save();

        return staff;
    }

    async remove(id: number) {
        const staff = await this.findOne(id);

        await staff.destroy();

        return { status: HttpStatus.OK };
    }

    async getStaffByNamesArray(names: string[]): Promise<Staff[]> {
        const staffs = await this.staffRepository.findAll({
            where: {
                name: {
                    [Op.or]: names,
                },
            },
        });

        if (!staffs) {
            throw new HttpException(
                'Сотрудники не найдены',
                HttpStatus.NOT_FOUND,
            );
        }

        return staffs;
    }
}
