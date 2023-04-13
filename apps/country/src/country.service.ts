import { Injectable } from '@nestjs/common';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';

@Injectable()
export class CountryService {
  constructor() {}

  async createMany(createCountryDtoArray: CreateCountryDto[]) {
    return createCountryDtoArray;
  }

  async create(createCountryDto: CreateCountryDto) {
    return createCountryDto;
  }

  async findAll() {
    return ;
  }

  async findOne(id: number) {
    return id;
  }

  async update(id: number, updateCountryDto: UpdateCountryDto) {
    return {id, ...updateCountryDto};
  }

  async remove(id: number) {
    return id;
  }
}
