import { Country, CreateCountryDto, UpdateCountryDto } from '@app/models';
import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

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
            throw new RpcException(new NotFoundException('Страна не найдена'));
        }

        return country;
    }

    async findByname(name: string): Promise<Country> {
        const country = this.countryRepository.findOne({ where: { name } });

        if (!country) {
            throw new RpcException(new NotFoundException('Страна не найдена'));
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
            throw new RpcException(new NotFoundException('Страны не найдены'));
        }

        return countries;
    }
}
