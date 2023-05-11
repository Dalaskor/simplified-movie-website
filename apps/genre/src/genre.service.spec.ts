import { CreateGenreDto, Genre, UpdateGenreDto } from '@app/models';
import { HttpStatus } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';
import { Test } from '@nestjs/testing';
import { Op } from 'sequelize';
import { GenreService } from './genre.service';

const testGenre = {
  name: 'Test',
  name_en: 'Test En',
};

const testManyGenres = [
  {
    name: 'Test 1',
    name_en: 'Test En 1',
  },
  {
    name: 'Test 2',
    name_en: 'Test En 2',
  },
];

const testCreateGenreDto: CreateGenreDto = {
  name: 'Test',
  name_en: 'Test En',
};

const testCreateManyGenresDto: CreateGenreDto[] = [
  {
    name: 'Test 1',
    name_en: 'Test En 1',
  },
  {
    name: 'Test 2',
    name_en: 'Test En 2',
  },
];

const testUpdateGenreDto: UpdateGenreDto = {
  id: 1,
  name: 'Test',
  name_en: 'Test En',
};

describe('GenreService', () => {
  let service: GenreService;
  let model: typeof Genre;

  beforeEach(async () => {
    const modRef = await Test.createTestingModule({
      providers: [
        GenreService,
        {
          provide: getModelToken(Genre),
          useValue: {
            findAll: jest.fn(() => [testGenre]),
            findOne: jest.fn(),
            create: jest.fn(() => testGenre),
            bulkCreate: jest.fn(() => testManyGenres),
          },
        },
      ],
    }).compile();

    service = modRef.get(GenreService);
    model = modRef.get<typeof Genre>(getModelToken(Genre));
  });

  it('should create many genres', async () => {
    expect(await service.createMany(testCreateManyGenresDto)).toEqual(
      testManyGenres,
    );
  });

  it('should create new genre', async () => {
    expect(await service.create(testCreateGenreDto)).toEqual(testGenre);
  });

  it('should find all genres', async () => {
    expect(await service.findAll()).toEqual([testGenre]);
  });

  it('should find one genre by id', async () => {
    const saveStub = jest.fn();
    const findspy = jest.spyOn(model, 'findOne').mockReturnValue({
      save: saveStub,
    } as any);
    expect(await service.findOne(1));
    expect(findspy).toBeCalledWith({ where: { id: 1 } });
  });

  it('should update genre', async () => {
    const saveStub = jest.fn();
    const findSpy = jest.spyOn(model, 'findOne').mockReturnValue({
      save: saveStub,
    } as any);
    const retVal = await service.update(
      testUpdateGenreDto.id,
      testUpdateGenreDto,
    );

    expect(findSpy).toBeCalledWith({
      where: { id: testUpdateGenreDto.id },
    });
    expect(saveStub).toBeCalledTimes(1);
  });

  it('should remove genre', async () => {
    const destroyStub = jest.fn();
    const findSpy = jest
      .spyOn(model, 'findOne')
      .mockReturnValue({ destroy: destroyStub } as any);
    const retVal = await service.remove(1);

    expect(findSpy).toBeCalledWith({ where: { id: 1 } });
    expect(destroyStub).toBeCalledTimes(1);
    expect(retVal).toMatchObject({ status: HttpStatus.OK });
  });

  it('should find genres by names array', async () => {
    const saveStub = jest.fn();
    const findspy = jest.spyOn(model, 'findAll').mockReturnValue({
      save: saveStub,
    } as any);
    const names = ['Test 1', 'Test 2'];
    expect(await service.getGenresByNamesArray(names));
    expect(findspy).toBeCalledWith({
      where: {
        name: {
          [Op.or]: names,
        },
      },
    });
  });
});
