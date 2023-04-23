import { CreateGenreDto, Genre, UpdateGenreDto } from '@app/models';
import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

@Injectable()
export class GenreService {
    constructor(@InjectModel(Genre) private genreRepository: typeof Genre) {}

    async createMany(createGenreDtoArray: CreateGenreDto[]) {
        const genres = await this.genreRepository.bulkCreate(
            createGenreDtoArray,
            { ignoreDuplicates: true },
        );

        return genres;
    }

    async create(createGenreDto: CreateGenreDto) {
        const genre = this.genreRepository.create(createGenreDto);

        return genre;
    }

    async findAll() {
        const genres = this.genreRepository.findAll({
            include: { all: true },
        });

        return genres;
    }

    async findOne(id: number) {
        const genre = this.genreRepository.findOne({ where: { id } });

        if (!genre) {
            throw new RpcException(new NotFoundException('Жанр не найден'));
        }

        return genre;
    }

    async update(id: number, updateGenreDto: UpdateGenreDto) {
        const genre = await this.findOne(id);

        genre.name = updateGenreDto.name;

        await genre.save();

        return genre;
    }

    async remove(id: number) {
        const genre = await this.findOne(id);

        await genre.destroy();

        return { status: HttpStatus.OK };
    }

    async getGenresByNamesArray(names: string[]): Promise<Genre[]> {
        const genres = await this.genreRepository.findAll({
            where: {
                name: {
                    [Op.or]: names,
                },
            },
        });

        if (!genres) {
            throw new RpcException(new NotFoundException('Жанры не найдены'));
        }

        return genres;
    }
}
