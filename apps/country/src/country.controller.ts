import { Controller } from '@nestjs/common';
import { CountryService } from './country.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Country, CreateCountryDto, UpdateCountryDto } from '@app/models';

@Controller()
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  /**
   * Создает страны при заполнении бд.
   * @param {CreateCountryDto[]} createCountryDtoArray DTO для создания стран из массива.
   * @returns Country[] - Массив созданных стран
   */
  @MessagePattern('createManyCountry')
  async createMany(
    @Payload() createCountryDtoArray: CreateCountryDto[],
  ): Promise<Country[]> {
    return await this.countryService.createMany(createCountryDtoArray);
  }

  /**
   * Создает одну новую страну.
   * @param {CreateCountryDto} createCountryDto - DTO для создание страны.
   * @returns Country - Созданная страна
   */
  @MessagePattern('createCountry')
  async create(
    @Payload() createCountryDto: CreateCountryDto,
  ): Promise<Country> {
    return await this.countryService.create(createCountryDto);
  }

  /**
   * Получить список всех стран.
   * @returns Country[] - Список найденных стран.
   */
  @MessagePattern('findAllCountry')
  async findAll(): Promise<Country[]> {
    return await this.countryService.findAll();
  }

  /**
   * Найти одну страну по ID.
   * @param {number} id - Идентификатор страны.
   * @returns Country - Найденная страна.
   */
  @MessagePattern('findOneCountry')
  async findOne(@Payload() id: number): Promise<Country> {
    return await this.countryService.findOne(id);
  }

  /**
   * Найти страну по названию.
   * @param {string} name - Название страны.
   * @returns Country - Найденная страна.
   */
  @MessagePattern({ cmd: 'findOneByNameCountry' })
  async findOneByName(@Payload() name: string): Promise<Country> {
    return await this.countryService.findByname(name);
  }

  /**
   * Обновить данные о стране.
   * @param {UpdateCountryDto} updateCountryDto - DTO для обновления данных о стране.
   * @returns Country - Обновленная страна.
   */
  @MessagePattern('updateCountry')
  async update(
    @Payload() updateCountryDto: UpdateCountryDto,
  ): Promise<Country> {
    return await this.countryService.update(
      updateCountryDto.id,
      updateCountryDto,
    );
  }

  /**
   * Удалить страну.
   * @param {number} id - Идентификатор страны.
   * @returns Результат выполнения функции.
   */
  @MessagePattern('removeCountry')
  async remove(@Payload() id: number): Promise<any> {
    return await this.countryService.remove(id);
  }

  /**
   * Получить массив стран по списку названий.
   * @param {string[]} names - Списк названий стран.
   * @returns Country[] - Массив найденных стран.
   */
  @MessagePattern({ cmd: 'getCountriesByNames' })
  async getCountriesByNamesHandle(
    @Payload() names: string[],
  ): Promise<Country[]> {
    return await this.countryService.getCountriesByNamesArray(names);
  }
}
