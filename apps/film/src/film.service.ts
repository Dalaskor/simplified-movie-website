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
    let staffArray: CreateStaffDto[] = getStaffArray(createFilmDtoArray);
    this.staffClient.send('createManyStaff', staffArray);

    return createFilmDtoArray;

    function getStaffArray(createFilmDtoArray: CreateFilmDto[]) {
      let staffArray: CreateStaffDto[] = [];
      return staffArray;
    }
  }

  //не готова
  async create(createFilmDto: CreateFilmDto) {
    let staffArray: CreateStaffDto[] = getStaffArray(createFilmDto);
    this.staffClient.send('createManyStaff', staffArray);

    return createFilmDto;

    function getStaffArray(createFilmDtoArray: CreateFilmDto) {
      return createFilmDtoArray.artist.map(value => ({name: value}));
    }
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
}
