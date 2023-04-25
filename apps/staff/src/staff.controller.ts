import { Controller } from '@nestjs/common';
import { StaffService } from './staff.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PageOptionsDto } from '@app/common';
import { CreateStaffDto, Staff, UpdateStaffDto } from '@app/models';

@Controller()
export class StaffController {
    constructor(private readonly staffService: StaffService) {}

    @MessagePattern('createManyStaff')
    async createMany(
        @Payload() createStaffDtoArray: CreateStaffDto[],
    ): Promise<Staff[]> {
        return await this.staffService.createMany(createStaffDtoArray);
    }

    @MessagePattern('createStaff')
    async create(@Payload() createStaffDto: CreateStaffDto): Promise<Staff> {
        return await this.staffService.create(createStaffDto);
    }

    @MessagePattern('findAllStaff')
    async findAll(): Promise<Staff[]> {
        return await this.staffService.findAll();
    }

    @MessagePattern('findOneStaff')
    async findOne(@Payload() id: number): Promise<Staff> {
        return await this.staffService.findOne(id);
    }

    @MessagePattern('updateStaff')
    async update(
        @Payload() updateStaffDto: UpdateStaffDto,
    ): Promise<UpdateStaffDto> {
        return await this.staffService.update(
            updateStaffDto.id,
            updateStaffDto,
        );
    }

    @MessagePattern('removeStaff')
    async remove(@Payload() id: number): Promise<any> {
        return await this.staffService.remove(id);
    }

    @MessagePattern({ cmd: 'getStaffByNames' })
    async getStaffByNamesHandle(@Payload() names: string[]): Promise<Staff[]> {
        return await this.staffService.getStaffByNamesArray(names);
    }

    @MessagePattern('getStaffsWithPag')
    async getStaffsWithPag(
        @Payload() pageOptionsDto: PageOptionsDto,
    ): Promise<Staff[]> {
        return await this.staffService.getStaffsWithPag(pageOptionsDto);
    }
}
