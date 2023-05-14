import { Controller } from '@nestjs/common';
import { StaffService } from './staff.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PageOptionsDto } from '@app/common';
import { CreateStaffDto, Staff, UpdateStaffDto } from '@app/models';

@Controller()
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  /**
   * Контроллер на заполнение бд.
   * @param {CreateStaffDto[]} createStaffDtoArray - Список имен участников.
   * @returns Staff[] - Список участников созданных в бд.
   */
  @MessagePattern('createManyStaff')
  async createMany(
    @Payload() createStaffDtoArray: CreateStaffDto[],
  ): Promise<Staff[]> {
    return await this.staffService.createMany(createStaffDtoArray);
  }

  /**
   * Контроллер на создание нового участника.
   * @param {CreateStaffDto} createStaffDto - DTO для создания нового участника.
   * @returns Staff - Возвращает объект с данными участника.
   */
  @MessagePattern('createStaff')
  async create(@Payload() createStaffDto: CreateStaffDto): Promise<Staff> {
    return await this.staffService.create(createStaffDto);
  }

  /**
   * Контроллер на получение списка всех участников.
   * @returns Staff[] - Список всех участников.
   */
  @MessagePattern('findAllStaff')
  async findAll(): Promise<Staff[]> {
    return await this.staffService.findAll();
  }

  /**
   * Контроллер для получения участника.
   * @param {number} id - Идентификатор участника.
   * @returns Staff - Объект с данными участника.
   */
  @MessagePattern('findOneStaff')
  async findOne(@Payload() id: number): Promise<Staff> {
    return await this.staffService.findOne(id);
  }

  /**
   * Обновления данных участника.
   * @param {UpdateStaffDto} updateStaffDto - DTO для обновления данных участника.
   * @returns UpdateStaffDto - Обновленные данные участника.
   */
  @MessagePattern('updateStaff')
  async update(
    @Payload() updateStaffDto: UpdateStaffDto,
  ): Promise<UpdateStaffDto> {
    return await this.staffService.update(updateStaffDto.id, updateStaffDto);
  }

  /**
   * Удаление участника.
   * @param {number} id - Идентификатор участника.
   * @returns Результат удаления участника.
   */
  @MessagePattern('removeStaff')
  async remove(@Payload() id: number): Promise<any> {
    return await this.staffService.remove(id);
  }

  /**
   * Получить участников.
   * @param {string[]} names - Список имен участников.
   * @returns Staff[] - Список найденных участников.
   */
  @MessagePattern({ cmd: 'getStaffByNames' })
  async getStaffByNamesHandle(@Payload() names: string[]): Promise<Staff[]> {
    return await this.staffService.getStaffByNamesArray(names);
  }

  /**
   * Получить список участников с учетом фильтрации, сортировки и пагинации.
   * @param {PageOptionsDto} pageOptionsDto - DTO для фильтрации, сортировки
   * и пагинации списка участников.
   * @returns Staf[] - Список участников с учетом фильтрации, сортировки и пагинации.
   */
  @MessagePattern('getStaffsWithPag')
  async getStaffsWithPag(
    @Payload() pageOptionsDto: PageOptionsDto,
  ): Promise<Staff[]> {
    return await this.staffService.getStaffsWithPag(pageOptionsDto);
  }


  /**
   * Поиск актеров и режисеров по строке.
   * @param {string} finder - Строка для поиска.
   * @returns Результат выполнения функции.
   */
  @MessagePattern('searchActorsDirectorsByStr')
  async SearchFilmsByStr(@Payload() finder: string): Promise<Staff[]> {
    return await this.staffService.searchStaffsByStr(finder);
  }
}
