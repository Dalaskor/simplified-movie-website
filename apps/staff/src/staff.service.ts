import { Order, PageOptionsDto, STAFF_SERVICE, STAFF_TYPES } from '@app/common';
import {
    CreateStaffDto,
    CreateStaffTypeDto,
    Staff,
    StaffType,
    UpdateStaffDto,
} from '@app/models';
import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

@Injectable()
export class StaffService {
    constructor(
        @InjectModel(Staff) private staffRepository: typeof Staff,
        @InjectModel(StaffType) private staffTypeRepository: typeof StaffType,
    ) {}

    async createMany(createStaffDtoArray: CreateStaffDto[]) {
        const staffs = [];

        const types = await this.createStaffTypes();

        for (const dto of createStaffDtoArray) {
            const staff = await this.staffRepository.create({ name: dto.name });

            const typesIds = [];
            const typesArray = [];

            for (const dtoType of dto.types) {
                types.map((item) => {
                    if (item.name === dtoType) {
                        typesIds.push(item.id);
                    }
                });
                types.map((item) => {
                    if (item.name === dtoType) {
                        typesArray.push(item);
                    }
                });
            }

            await staff.$set('types', typesIds);
            staff.types = typesArray;

            await staff.save();

            staffs.push(staff);
        }

        return staffs;
    }

    async createStaffTypes() {
        const dtos: CreateStaffTypeDto[] = [];

        dtos.push({ name: STAFF_TYPES.ACTOR });
        dtos.push({ name: STAFF_TYPES.DIRECTOR });
        dtos.push({ name: STAFF_TYPES.MONTAGE });
        dtos.push({ name: STAFF_TYPES.ARTIST });
        dtos.push({ name: STAFF_TYPES.COMPOSITOR });
        dtos.push({ name: STAFF_TYPES.OPERATOR });
        dtos.push({ name: STAFF_TYPES.PRODUCER });
        dtos.push({ name: STAFF_TYPES.SCENARIO });

        const types = await this.staffTypeRepository.bulkCreate(dtos, {
            ignoreDuplicates: true,
        });

        return types;
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
            throw new RpcException(
                new NotFoundException('Участник фильма не найден'),
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
            throw new RpcException(
                new NotFoundException('Участник фильма не найден'),
            );
        }

        return staffs;
    }

    /*
     * Сервис для получения списка участников с пагинацией
     */
    async getStaffsWithPag(pageOptionsDto: PageOptionsDto) {
        const order: string = pageOptionsDto.order
            ? pageOptionsDto.order
            : Order.ASC;
        const page: number = pageOptionsDto.page ? pageOptionsDto.page : 1;
        const take: number = pageOptionsDto.take ? pageOptionsDto.take : 10;
        const skip = (page - 1) * take;

        const staffs = await this.staffRepository.findAll({
            order: [['createdAt', order]],
            offset: skip,
            limit: take,
            include: { all: true },
        });

        return staffs;
    }

    async getActors() {}
}
