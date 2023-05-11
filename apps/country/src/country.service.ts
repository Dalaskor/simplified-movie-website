import { Country, CreateCountryDto, UpdateCountryDto } from '@app/models';
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

@Injectable()
export class CountryService {
  constructor(
    @InjectModel(Country) private countryRepository: typeof Country,
  ) {}

  /**
   * Создает страны при заполнении бд.
   * @param {CreateCountryDto[]} createCountryDtoArray DTO для создания стран из массива.
   * @returns Country[] - Массив созданных стран
   */
  async createMany(
    createCountryDtoArray: CreateCountryDto[],
  ): Promise<Country[]> {
    const countries = await this.countryRepository.bulkCreate(
      createCountryDtoArray,
      { ignoreDuplicates: true },
    );

    return countries;
  }

  /**
   * Создает одну новую страну.
   * @param {CreateCountryDto} createCountryDto - DTO для создание страны.
   * @returns Country - Созданная страна
   * @throws BadRequestException
   */
  async create(createCountryDto: CreateCountryDto): Promise<Country> {
    const candidate = await this.countryRepository.findOne({
      where: { name: createCountryDto.name },
    });

    if (candidate) {
      throw new RpcException(
        new BadRequestException('Такая страна уже существует'),
      );
    }

    const country = await this.countryRepository.create(createCountryDto);

    return country;
  }

  /**
   * Получить список всех стран.
   * @returns Country[] - Список найденных стран.
   */
  async findAll(): Promise<Country[]> {
    const countries = await this.countryRepository.findAll();

    return countries;
  }

  /**
   * Найти одну страну по ID.
   * @param {number} id - Идентификатор страны.
   * @returns Country - Найденная страна.
   * @throws NotFoundException
   */
  async findOne(id: number): Promise<Country> {
    const country = await this.countryRepository.findOne({ where: { id } });

    if (!country) {
      throw new RpcException(new NotFoundException('Страна не найдена'));
    }

    return country;
  }

  /**
   * Найти страну по названию.
   * @param {string} name - Название страны.
   * @returns Country - Найденная страна.
   * @throws NotFoundException
   */
  async findByname(name: string): Promise<Country> {
    const country = await this.countryRepository.findOne({
      where: { name },
    });

    if (!country) {
      throw new RpcException(new NotFoundException('Страна не найдена'));
    }

    return country;
  }

  /**
   * Обновить данные о стране.
   * @param {UpdateCountryDto} updateCountryDto - DTO для обновления данных о стране.
   * @returns Country - Обновленная страна.
   */
  async update(
    id: number,
    updateCountryDto: UpdateCountryDto,
  ): Promise<Country> {
    const country = await this.findOne(id);

    country.name = updateCountryDto.name;

    await country.save();

    return country;
  }

  /**
   * Удалить страну.
   * @param {number} id - Идентификатор страны.
   * @returns Результат выполнения функции.
   */
  async remove(id: number): Promise<any> {
    const country = await this.findOne(id);

    await country.destroy();

    return { status: HttpStatus.OK };
  }

  /**
   * Получить массив стран по списку названий.
   * @param {string[]} names - Списк названий стран.
   * @returns Country[] - Массив найденных стран.
   */
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
