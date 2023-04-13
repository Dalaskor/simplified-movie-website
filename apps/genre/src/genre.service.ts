import { Injectable } from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';

@Injectable()
export class GenreService {
  constructor() {}

  async createMany(createGenreDtoArray: CreateGenreDto[]) {
    return createGenreDtoArray;
  }

  async create(createGenreDto: CreateGenreDto) {
    return createGenreDto;
  }

  async findAll() {
    return ;
  }

  async findOne(id: number) {
    return id;
  }

  async update(id: number, updateGenreDto: UpdateGenreDto) {
    return {id, ...updateGenreDto};
  }

  async remove(id: number) {
    return id;
  }
}
