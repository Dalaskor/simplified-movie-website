import { Order, STAFF_TYPES } from '@app/common';
import {
  CreateStaffDto,
  CreateStaffTypeDto,
  Staff,
  StaffPagFilter,
  StaffType,
  UpdateStaffDto,
} from '@app/models';
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
export class StaffService {
  constructor(
    @InjectModel(Staff) private staffRepository: typeof Staff,
    @InjectModel(StaffType) private staffTypeRepository: typeof StaffType,
  ) {}

  /**
   * Создать множество участников для заполнения базы данных.
   * @param {CreateStaffDto[]} createStaffDtoArray - Массив с именами участинков.
   * @returns Staff[] - Массив с участниками созданных в бд.
   * @throws BadRequestException
   */
  async createMany(createStaffDtoArray: CreateStaffDto[]): Promise<Staff[]> {
    const staffs = [];

    const types = await this.createStaffTypes();

    for (const dto of createStaffDtoArray) {
      const candidate = await this.staffRepository.findOne({
        where: { name: dto.name },
      });

      if (candidate) {
        continue;
      }

      const staff = await this.staffRepository.create({ name: dto.name });

      /* if (!staff) {
                throw new RpcException(
                    new BadRequestException('Ошибка создания участника.'),
                );
            } */

      const typesIds = [];
      const typesArray = [];

      for (const dtoType of dto.types) {
        types.map((item) => {
          if (item.name === dtoType) {
            typesIds.push(item.id);
          }
        });
        types.map((item) => {
          if (item.name === dtoType) {
            typesArray.push(item);
          }
        });
      }

      await staff.$set('types', typesIds);
      staff.types = typesArray;

      await staff.save();

      staffs.push(staff);
    }

    return staffs;
  }

  /**
   * Создает типы участников при заполнении бд или при создании нового участника,
   * если они не были созданы.
   * @private
   * @returns StaffType[] - Массив типов участинков созданных в бд.
   */
  private async createStaffTypes(): Promise<StaffType[]> {
    const dtos: CreateStaffTypeDto[] = [];

    dtos.push({ name: STAFF_TYPES.ACTOR });
    dtos.push({ name: STAFF_TYPES.DIRECTOR });
    dtos.push({ name: STAFF_TYPES.MONTAGE });
    dtos.push({ name: STAFF_TYPES.ARTIST });
    dtos.push({ name: STAFF_TYPES.COMPOSITOR });
    dtos.push({ name: STAFF_TYPES.OPERATOR });
    dtos.push({ name: STAFF_TYPES.PRODUCER });
    dtos.push({ name: STAFF_TYPES.SCENARIO });

    const types = await this.staffTypeRepository.bulkCreate(dtos, {
      ignoreDuplicates: true,
    });

    return types;
  }

  /**
   * Создает одного нового участника.
   * @param {CreateStaffDto} createStaffDto - DTO для создания участника.
   * @returns Staff - Возвращает созданного участника.
   * @throws BadRequestException
   */
  async create(createStaffDto: CreateStaffDto): Promise<Staff> {
    const countTypes = await this.staffTypeRepository.count();

    if (!countTypes) {
      await this.createStaffTypes();
    }

    const candidate = await this.staffRepository.findOne({
      where: {
        name: createStaffDto.name,
      },
    });

    if (candidate) {
      throw new RpcException(
        new BadRequestException('Такой человек уже существует'),
      );
    }

    const staffTypes = await this.staffTypeRepository.findAll({
      where: {
        name: {
          [Op.or]: createStaffDto.types,
        },
      },
    });

    if (staffTypes.length === 0) {
      throw new RpcException(
        new BadRequestException('Такого типа участника не существует'),
      );
    }

    const staff = await this.staffRepository.create(createStaffDto);

    if (!staff) {
      throw new RpcException(
        new BadRequestException('Ошибка создания участника.'),
      );
    }

    const staffTypeIds = staffTypes.map((item) => item.id);

    await staff.$set('types', staffTypeIds);
    staff.types = staffTypes;

    await staff.save();

    return staff;
  }

  /**
   * Возвращает список всех участников.
   * @returns Staff[] - Список участников.
   */
  async findAll(): Promise<Staff[]> {
    const staffs = await this.staffRepository.findAll({
      include: { all: true },
    });

    return staffs;
  }

  /**
   * Возвращает участника, найденного по ID.
   * @param {number} id - Идентификатор участника в бд.
   * @returns Staff - Найденный участник из бд.
   * @throws NotFoundException
   */
  async findOne(id: number): Promise<Staff> {
    const staff = await this.staffRepository.findOne({
      where: { id },
      include: { all: true },
    });

    if (!staff) {
      throw new RpcException(
        new NotFoundException('Участник фильма не найден'),
      );
    }

    return staff;
  }

  /**
   * Обновляет данные о участнике и возвращает его.
   * @param {number} id - Идентификатор участника в бд.
   * @param {UpdateStaffDto} updateStaffDto - DTO для обновления данных участника.
   * @returns UpdateStaffDto - Новые данные участника.
   * @throws BadRequestException, NotFoundException
   */
  async update(
    id: number,
    updateStaffDto: UpdateStaffDto,
  ): Promise<UpdateStaffDto> {
    const staffTypes = await this.staffTypeRepository.findAll({
      where: {
        name: {
          [Op.or]: updateStaffDto.types,
        },
      },
    });

    if (staffTypes.length === 0) {
      throw new RpcException(
        new BadRequestException('Такого типа участника не существует'),
      );
    }

    const staff = await this.findOne(id);

    const typeIds = staffTypes.map((item) => item.id);

    await staff.$set('types', typeIds);

    staff.name = updateStaffDto.name;
    staff.types = staffTypes;

    await staff.save();

    return updateStaffDto;
  }

  /**
   * Удаляет участника из базы данных.
   * @param {number} id - Идентификатор участника в бд.
   * @returns HttpStatus - OK
   */
  async remove(id: number): Promise<any> {
    const staff = await this.findOne(id);

    await staff.destroy();

    return { status: HttpStatus.OK };
  }

  /**
   * Находит участников в бд.
   * @param {string[]} names - Список имен участников.
   * @returns Возвращает список участников из базы данных.
   * @throws NotFoundException
   */
  async getStaffByNamesArray(names: string[]): Promise<Staff[]> {
    const staffs = await this.staffRepository.findAll({
      where: {
        name: {
          [Op.or]: names,
        },
      },
    });

    if (!staffs) {
      throw new RpcException(
        new NotFoundException('Участник фильма не найден'),
      );
    }

    return staffs;
  }

  /**
   * Получает список участников с учетом фильтрации, сортировки и пагинации.
   * @param {StaffPagFilter} pageOptionsDto - DTO для фильтрации, сортировки и пагинации.
   * @returns Staff[] - Список участников с учетом фильтрации, сортировки и пагинации.
   */
  async getStaffsWithPag(pageOptionsDto: StaffPagFilter): Promise<Staff[]> {
    const order: string = pageOptionsDto.order
      ? pageOptionsDto.order
      : Order.ASC;
    const page: number = pageOptionsDto.page ? pageOptionsDto.page : 1;
    const take: number = pageOptionsDto.take ? pageOptionsDto.take : 10;
    const skip = (page - 1) * take;

    let typeFilter: string[] = pageOptionsDto.type ? [pageOptionsDto.type] : [];

    let search = {};
    if (pageOptionsDto.search) {
      const finder: string = `%${pageOptionsDto.search}%`;
      search = {
        name: {
          [Op.iLike]: finder,
        },
      };
    }

    const staffs = await this.staffRepository.findAll({
      include: [
        {
          model: StaffType,
          where: {
            name: {
              [Op.or]: typeFilter,
            },
          },
        },
        { all: true },
      ],
      where: search,
      order: [['createdAt', order]],
      offset: skip,
      limit: take,
    });

    return staffs;
  }

  /**
   * Поиск участников по строке
   */
  async searchStaffsByStr(finder: string): Promise<Staff[]> {
    if (!finder) {
      throw new RpcException(new BadRequestException('Строка пустая'));
    }
    finder = `%${finder}%`;
    const staffs = await this.staffRepository.findAll({
      include: {
        model: StaffType,
        where: {
          name: {
            [Op.or]: ['actor', 'director'],
          },
        },
      },
      where: {
        name: {
          [Op.iLike]: finder,
        },
      },
      limit: 10,
    });
    return staffs;
  }
}
