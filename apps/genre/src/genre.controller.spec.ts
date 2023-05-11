import { CreateGenreDto, UpdateGenreDto } from '@app/models';
import { Test } from '@nestjs/testing';
import { GenreController } from './genre.controller';
import { GenreService } from './genre.service';

const testGenre = {
  id: 1,
  name: 'Test',
  name_en: 'Test en',
};

const testManyGenre = [
  {
    name: 'Test 1',
    name_en: 'Test en 1',
  },
  {
    name: 'Test 2',
    name_en: 'Test en 2',
  },
];

const testCreateGenreDto: CreateGenreDto = {
  name: 'Test',
  name_en: 'Test en',
};

const testCreateManyGenreDto: CreateGenreDto[] = [
  {
    name: 'Test 1',
    name_en: 'Test en 1',
  },
  {
    name: 'Test 2',
    name_en: 'Test en 2',
  },
];

const testUpdateGenreDto: UpdateGenreDto = {
  id: 1,
  name: 'New Test',
  name_en: 'New Test en',
};

describe('GerneController', () => {
  let controller: GenreController;
  let service: GenreService;

  beforeEach(async () => {
    const modRef = await Test.createTestingModule({
      controllers: [GenreController],
      providers: [
        {
          provide: GenreService,
          useValue: {
            createMany: jest.fn(() => testManyGenre),
            create: jest.fn(() => testGenre),
            findAll: jest.fn(() => [testGenre]),
            findOne: jest.fn().mockImplementation((id: number) =>
              Promise.resolve({
                id,
                name: 'Test',
                name_en: 'Test en',
              }),
            ),
            getGenresByNamesArray: jest
              .fn()
              .mockImplementation((names: string[]) =>
                Promise.resolve([
                  {
                    id: 1,
                    name: names[0],
                    name_en: 'Test en 1',
                  },
                  {
                    id: 2,
                    name: names[1],
                    name_en: 'Test en 2',
                  },
                ]),
              ),
            update: jest
              .fn()
              .mockImplementation((id: number, dto: UpdateGenreDto) =>
                Promise.resolve({
                  id,
                  name: dto.name,
                  name_en: dto.name_en,
                }),
              ),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = modRef.get(GenreController);
    service = modRef.get<GenreService>(GenreService);
  });

  it('should make many genres', async () => {
    expect(await controller.createMany(testCreateManyGenreDto)).toEqual(
      testManyGenre,
    );
  });

  it('should create new genre', async () => {
    expect(await controller.create(testCreateGenreDto)).toEqual(testGenre);
  });

  it('should find all genres', async () => {
    expect(await controller.findAll()).toEqual([testGenre]);
  });

  it('should find one genre by id', async () => {
    await controller.findOne(1);
    expect(service.findOne).toHaveBeenCalled();
    expect(controller.findOne(1)).resolves.toEqual({
      id: 1,
      name: 'Test',
      name_en: 'Test en',
    });
  });

  it('should update the genre', async () => {
    await controller.update(testUpdateGenreDto);
    expect(service.update).toHaveBeenCalled();
    expect(controller.update(testUpdateGenreDto)).resolves.toEqual({
      id: testUpdateGenreDto.id,
      name: testUpdateGenreDto.name,
      name_en: testUpdateGenreDto.name_en,
    });
  });

  it('should remove the genre', async () => {
    await controller.remove(1);
    expect(service.remove).toHaveBeenCalled();
  });

  it('should find the genres by names array', async () => {
    const names: string[] = ['Test 1', 'Test 2'];
    await controller.getGenresByNamesHandle(names);
    expect(service.getGenresByNamesArray).toHaveBeenCalled();
    expect(controller.getGenresByNamesHandle(names)).resolves.toEqual([
      {
        id: 1,
        name: names[0],
        name_en: 'Test en 1',
      },
      {
        id: 2,
        name: names[1],
        name_en: 'Test en 2',
      },
    ]);
  });
});
