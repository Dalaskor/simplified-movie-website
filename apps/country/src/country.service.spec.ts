import { Country, CreateCountryDto, UpdateCountryDto } from '@app/models';
import { HttpStatus } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';
import { Test } from '@nestjs/testing';
import { Op } from 'sequelize';
import { CountryService } from './country.service';

const testCountry = {
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

const testCreateManyCountryDto: CreateCountryDto[] = [
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

const testUpdateCountryDto: UpdateCountryDto = {
  id: 1,
  name: 'New Test',
};

describe('countryService', () => {
  let service: CountryService;
  let model: typeof Country;

  beforeEach(async () => {
    const modRef = await Test.createTestingModule({
      providers: [
        CountryService,
        {
          provide: getModelToken(Country),
          useValue: {
            findAll: jest.fn(() => [testCountry]),
            findOne: jest.fn(),
            create: jest.fn(() => testCountry),
            bulkCreate: jest.fn(() => testManyCountry),
          },
        },
      ],
    }).compile();

    service = modRef.get(CountryService);
    model = modRef.get<typeof Country>(getModelToken(Country));
  });

  it('should get the countries', async () => {
    expect(await service.findAll()).toEqual([testCountry]);
  });

  it('should add a country', async () => {
    expect(await service.create(testCreateCountryDto)).toEqual(testCountry);
  });

  it('should create many country', async () => {
    expect(await service.createMany(testCreateManyCountryDto)).toEqual(
      testManyCountry,
    );
  });

  it('should get a single country', async () => {
    const saveStub = jest.fn();
    const findspy = jest.spyOn(model, 'findOne').mockReturnValue({
      save: saveStub,
    } as any);
    expect(await service.findOne(1));
    expect(findspy).toBeCalledWith({ where: { id: 1 } });
  });

  it('should update a country', async () => {
    const saveStub = jest.fn();
    const findSpy = jest.spyOn(model, 'findOne').mockReturnValue({
      save: saveStub,
    } as any);
    const retVal = await service.update(
      testUpdateCountryDto.id,
      testUpdateCountryDto,
    );

    expect(findSpy).toBeCalledWith({
      where: { id: testUpdateCountryDto.id },
    });
    expect(saveStub).toBeCalledTimes(1);
  });

  it('should remove a country', async () => {
    const destroyStub = jest.fn();
    const findSpy = jest
      .spyOn(model, 'findOne')
      .mockReturnValue({ destroy: destroyStub } as any);
    const retVal = await service.remove(1);

    expect(findSpy).toBeCalledWith({ where: { id: 1 } });
    expect(destroyStub).toBeCalledTimes(1);
    expect(retVal).toMatchObject({ status: HttpStatus.OK });
  });

  it('should find country by name', async () => {
    const saveStub = jest.fn();
    const findspy = jest.spyOn(model, 'findOne').mockReturnValue({
      save: saveStub,
    } as any);
    expect(await service.findByname('Test'));
    expect(findspy).toBeCalledWith({ where: { name: 'Test' } });
  });

  it('should find countries by names array', async () => {
    const saveStub = jest.fn();
    const findspy = jest.spyOn(model, 'findAll').mockReturnValue({
      save: saveStub,
    } as any);
    const names = ['Test 1', 'Test 2'];
    expect(await service.getCountriesByNamesArray(names));
    expect(findspy).toBeCalledWith({
      where: {
        name: {
          [Op.or]: names,
        },
      },
    });
  });
});
