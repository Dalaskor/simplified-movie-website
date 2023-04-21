import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Country } from './country.model';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';

@Injectable()
export class CountryService {
    constructor(
        @InjectModel(Country) private countryRepository: typeof Country,
    ) {}

    async createMany(createCountryDtoArray: CreateCountryDto[]) {
        const countries = await this.countryRepository.bulkCreate(
            createCountryDtoArray,
            { ignoreDuplicates: true },
        );

        return countries;
    }

    async create(createCountryDto: CreateCountryDto) {
        const country = this.countryRepository.create(createCountryDto);

        return country;
    }

    async findAll() {
        const countries = this.countryRepository.findAll({
            include: { all: true },
        });

        return countries;
    }

    async findOne(id: number) {
        const country = this.countryRepository.findOne({ where: { id } });

        if (!country) {
            throw new HttpException('Страна не найдена', HttpStatus.NOT_FOUND);
        }

        return country;
    }

    async findByname(name: string): Promise<Country> {
        const country = this.countryRepository.findOne({ where: { name } });

        if (!country) {
            throw new HttpException('Страна не найдена', HttpStatus.NOT_FOUND);
        }

        return country;
    }

    async update(id: number, updateCountryDto: UpdateCountryDto) {
        const country = await this.findOne(id);

        country.name = updateCountryDto.name;

        await country.save();

        return country;
    }

    async remove(id: number) {
        const country = await this.findOne(id);

        await country.destroy();

        return { status: HttpStatus.OK };
    }

    async getCountriesByNamesArray(names: string[]): Promise<Country[]> {
        const countries = await this.countryRepository.findAll({
            where: {
                name: {
                    [Op.or]: names,
                },
            },
        });

        if (!countries) {
            throw new HttpException('Страны не найдены', HttpStatus.NOT_FOUND);
        }

        return countries;
    }
}
