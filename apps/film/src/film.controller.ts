import { Controller } from '@nestjs/common';
import { FilmService } from './film.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';

@Controller()
export class FilmController {
  constructor(private readonly filmService: FilmService) {}

  @MessagePattern('createFilm')
  async create(@Payload() createFilmDto: CreateFilmDto) {
    return await this.filmService.create(createFilmDto);
  }

  @MessagePattern('findAllFilm')
  async findAll() {
    return await this.filmService.findAll();
  }

  @MessagePattern('findOneFilm')
  async findOne(@Payload() id: number) {
    return await this.filmService.findOne(id);
  }

  @MessagePattern('updateFilm')
  async update(@Payload() updateFilmDto: UpdateFilmDto) {
    return await this.filmService.update(updateFilmDto.id, updateFilmDto);
  }

  @MessagePattern('removeFilm')
  async remove(@Payload() id: number) {
    return await this.filmService.remove(id);
  }
}
