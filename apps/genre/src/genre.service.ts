import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { Genre } from './genre.model';

@Injectable()
export class GenreService {
    constructor(@InjectModel(Genre) private genreRepository: typeof Genre) {}
    async createMany(createGenreDtoArray: CreateGenreDto[]) {
        const genres = await this.genreRepository.bulkCreate(
            createGenreDtoArray,
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
            throw new HttpException('Жанр не найден', HttpStatus.NOT_FOUND);
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

    async getGenresByNamesArray(names: string[]) {
        const genres = await this.genreRepository.findAll({
            where: {
                name: {
                    [Op.or]: names
                },
            },
        });

        return genres;
    }
}
