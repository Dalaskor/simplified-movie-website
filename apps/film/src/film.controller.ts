import { Controller } from '@nestjs/common';
import { FilmService } from './film.service';
import {
    Ctx,
    MessagePattern,
    Payload,
    RmqContext,
} from '@nestjs/microservices';
import { RmqService } from '@app/common';
import { CreateFilmDto, FilmPagFilterDto, UpdateFilmDto } from '@app/models';

@Controller()
export class FilmController {
    constructor(
        private readonly filmService: FilmService,
        private readonly rmqService: RmqService,
    ) {}

    @MessagePattern('createManyFilm')
    async createMany(
        @Payload() createFilmDtoArray: CreateFilmDto[],
        @Ctx() context: RmqContext,
    ) {
        this.rmqService.ack(context);
        return await this.filmService.createMany(createFilmDtoArray);
    }

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

    @MessagePattern('getFilmsWithPag')
    async getFilmsWithPag(@Payload() pageOptionsDto: FilmPagFilterDto) {
        return await this.filmService.getFilmWithPag(pageOptionsDto);
    }

    @MessagePattern('incFilmRating')
    async incFilmRating(@Payload() data: any) {
        return await this.filmService.incFilmRating(
            data.film_id,
            data.count,
            data.value,
        );
    }

    @MessagePattern('decFilmRating')
    async decFilmRating(@Payload() data: any) {
        return await this.filmService.decFilmRating(
            data.film_id,
            data.count,
            data.value,
        );
    }

    @MessagePattern('updateFilmRating')
    async updateFilmRating(@Payload() data: any) {
        return await this.filmService.updateFilmRating(
            data.film_id,
            data.count,
            data.old_value,
            data.new_value,
        );
    }

    @MessagePattern('checkFilmExistById')
    async CheckFilmExistById(@Payload() id: number) {
        return await this.filmService.checkFilmExistById(id);
    }
}
