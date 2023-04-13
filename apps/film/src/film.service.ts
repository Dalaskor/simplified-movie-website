import { Injectable } from '@nestjs/common';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';

@Injectable()
export class FilmService {
  constructor() {}

  async create(createFilmDto: CreateFilmDto) {
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
}
