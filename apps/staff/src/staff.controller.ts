import { Controller, Get } from '@nestjs/common';
import { StaffService } from './staff.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';

@Controller()
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @MessagePattern('createManyStaff')
  async createMany(@Payload() createStaffDtoArray: CreateStaffDto[]) {
    return await this.staffService.createMany(createStaffDtoArray);
  }

  @MessagePattern('createStaff')
  async create(@Payload() createStaffDto: CreateStaffDto) {
    return await this.staffService.create(createStaffDto);
  }

  @MessagePattern('findAllStaff')
  async findAll() {
    return await this.staffService.findAll();
  }

  @MessagePattern('findOneStaff')
  async findOne(@Payload() id: number) {
    return await this.staffService.findOne(id);
  }

  @MessagePattern('updateStaff')
  async update(@Payload() updateStaffDto: UpdateStaffDto) {
    return await this.staffService.update(updateStaffDto.id, updateStaffDto);
  }

  @MessagePattern('removeStaff')
  async remove(@Payload() id: number) {
    return await this.staffService.remove(id);
  }
}
