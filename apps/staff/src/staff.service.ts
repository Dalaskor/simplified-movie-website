import { Injectable } from '@nestjs/common';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';

@Injectable()
export class StaffService {
  constructor() {}

  async create(createStaffDto: CreateStaffDto) {
    return createStaffDto;
  }

  async findAll() {
    return ;
  }

  async findOne(id: number) {
    return id;
  }

  async update(id: number, updateStaffDto: UpdateStaffDto) {
    return {id, ...updateStaffDto};
  }

  async remove(id: number) {
    return id;
  }
}
