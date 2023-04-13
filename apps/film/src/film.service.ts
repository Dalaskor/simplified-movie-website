import { Injectable } from '@nestjs/common';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { ClientProxy } from '@nestjs/microservices';
import { CreateStaffDto } from 'apps/staff/src/dto/create-staff.dto';

@Injectable()
export class FilmService {
  constructor(private readonly staffClient: ClientProxy) {}

  // не готова
  async createMany(createFilmDtoArray: CreateFilmDto[]) {
    let staffArray: CreateStaffDto[] = this.getStaffArray(createFilmDtoArray);
    this.staffClient.send('createManyStaff', staffArray);

    return createFilmDtoArray;
  }

  //не готова
  async create(createFilmDto: CreateFilmDto) {
    let staffArray: CreateStaffDto[] = this.getStaffArray([createFilmDto]);
    this.staffClient.send('createManyStaff', staffArray);

    return createFilmDto;
  }

  async findAll() {
    return ;
  }

  async findOne(id: number) {
    return id;
  }

  async update(id: number, updateFilmDto: UpdateFilmDto) {
    return {id, ...updateFilmDto};
  }

  async remove(id: number) {
    return id;
  }

  getStaffArray(createFilmDtoArray: CreateFilmDto[]): CreateStaffDto[] {
    let staffArray: CreateStaffDto[] = [];

    createFilmDtoArray.forEach(value => {
      value.director.forEach(name => {if (!staffArray.find(value => value.name == name)) staffArray.push({name});});
      value.scenario.forEach(name => {if (!staffArray.find(value => value.name == name)) staffArray.push({name});});
      value.producer.forEach(name => {if (!staffArray.find(value => value.name == name)) staffArray.push({name});});
      value.operator.forEach(name => {if (!staffArray.find(value => value.name == name)) staffArray.push({name});});
      value.compositor.forEach(name => {if (!staffArray.find(value => value.name == name)) staffArray.push({name});});
      value.artist.forEach(name => {if (!staffArray.find(value => value.name == name)) staffArray.push({name});});
      value.montage.forEach(name => {if (!staffArray.find(value => value.name == name)) staffArray.push({name});});
      value.actors.forEach(name => {if (!staffArray.find(value => value.name == name)) staffArray.push({name});});
    })

    return staffArray;
  }
}
