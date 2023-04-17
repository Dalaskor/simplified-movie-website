import { Controller, Get } from '@nestjs/common';
import { GenreService } from './genre.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';

@Controller()
export class GenreController {
    constructor(private readonly genreService: GenreService) {}

    @MessagePattern('createManyGenre')
    async createMany(@Payload() createGenreDtoArray: CreateGenreDto[]) {
        return await this.genreService.createMany(createGenreDtoArray);
    }

    @MessagePattern('createGenre')
    async create(@Payload() createGenreDto: CreateGenreDto) {
        return await this.genreService.create(createGenreDto);
    }

    @MessagePattern('findAllGenre')
    async findAll() {
        return await this.genreService.findAll();
    }

    @MessagePattern('findOneGenre')
    async findOne(@Payload() id: number) {
        return await this.genreService.findOne(id);
    }

    @MessagePattern('updateGenre')
    async update(@Payload() updateCountryDto: UpdateGenreDto) {
        return await this.genreService.update(
            updateCountryDto.id,
            updateCountryDto,
        );
    }

    @MessagePattern('removeGenre')
    async remove(@Payload() id: number) {
        return await this.genreService.remove(id);
    }

    @MessagePattern('getGenresByNames')
    async getStaffByNamesHandle(@Payload() names: string[]) {
        return await this.genreService.getGenresByNamesArray(names);
    }
}
