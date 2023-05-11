import { CreateCountryDto, UpdateCountryDto } from '@app/models';
import { Test } from '@nestjs/testing';
import { CountryController } from './country.controller';
import { CountryService } from './country.service';

const testCountry = {
  id: 1,
  name: 'Test',
};

const testManyCountry = [
  {
    name: 'Test 1',
  },
  {
    name: 'Test 2',
  },
];

const testCreateCountryDto: CreateCountryDto = {
  name: 'Test',
};

const testCreateManyCountryDto: CreateCountryDto[] = [
  {
    name: 'Test 1',
  },
  {
    name: 'Test 2',
  },
];

const testUpdateCountryDto: UpdateCountryDto = {
  id: 1,
  name: 'New Test',
};

describe('CountryController', () => {
  let controller: CountryController;
  let service: CountryService;

  beforeEach(async () => {
    const modRef = await Test.createTestingModule({
      controllers: [CountryController],
      providers: [
        {
          provide: CountryService,
          useValue: {
            createMany: jest.fn(() => testManyCountry),
            create: jest.fn(() => testCountry),
            findAll: jest.fn(() => [testCountry]),
            findOne: jest.fn().mockImplementation((id: number) =>
              Promise.resolve({
                id,
                name: 'Test',
              }),
            ),
            findByname: jest.fn().mockImplementation((name: string) =>
              Promise.resolve({
                id: 1,
                name,
              }),
            ),
            getCountriesByNamesArray: jest
              .fn()
              .mockImplementation((names: string[]) =>
                Promise.resolve([
                  {
                    id: 1,
                    name: names[0],
                  },
                  {
                    id: 2,
                    name: names[1],
                  },
                ]),
              ),
            update: jest
              .fn()
              .mockImplementation((id: number, dto: UpdateCountryDto) =>
                Promise.resolve({
                  id,
                  name: dto.name,
                }),
              ),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = modRef.get(CountryController);
    service = modRef.get<CountryService>(CountryService);
  });

  it('should make a new country', async () => {
    expect(await controller.create(testCreateCountryDto)).toEqual(testCountry);
  });

  it('should make a new countries', async () => {
    expect(await controller.createMany(testCreateManyCountryDto)).toEqual(
      testManyCountry,
    );
  });

  it('should get the countries', async () => {
    expect(await controller.findAll()).toEqual([testCountry]);
  });

  it('should get the country by id', async () => {
    await controller.findOne(1);
    expect(service.findOne).toHaveBeenCalled();
    expect(controller.findOne(1)).resolves.toEqual({
      id: 1,
      name: 'Test',
    });
  });

  it('should get the country by name', async () => {
    const name: string = 'Test';
    await controller.findOneByName(name);
    expect(service.findByname).toHaveBeenCalled();
    expect(controller.findOneByName(name)).resolves.toEqual({
      id: 1,
      name,
    });
  });

  it('should get the countries by names array', async () => {
    const names: string[] = ['Test 1', 'Test 2'];
    await controller.getCountriesByNamesHandle(names);
    expect(service.getCountriesByNamesArray).toHaveBeenCalled();
    expect(controller.getCountriesByNamesHandle(names)).resolves.toEqual([
      {
        id: 1,
        name: names[0],
      },
      {
        id: 2,
        name: names[1],
      },
    ]);
  });

  it('should remove the country', async () => {
    await controller.remove(1);
    expect(service.remove).toHaveBeenCalled();
  });

  it('should update the country', async () => {
    await controller.update(testUpdateCountryDto);
    expect(service.update).toHaveBeenCalled();
    expect(controller.update(testUpdateCountryDto)).resolves.toEqual({
      id: testUpdateCountryDto.id,
      name: testUpdateCountryDto.name,
    });
  });
});
