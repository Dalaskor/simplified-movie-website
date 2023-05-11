import { CreateStaffDto, Staff, StaffType, UpdateStaffDto } from '@app/models';
import { getModelToken } from '@nestjs/sequelize';
import { Test } from '@nestjs/testing';
import { Op } from 'sequelize';
import { StaffService } from './staff.service';

const testStaff = {
  name: 'Test',
  types: ['actor'],
};

const testManyStaff = [
  {
    name: 'Test 1',
    types: ['actor'],
  },
  {
    name: 'Test 2',
    types: ['actor'],
  },
];

const testStaffType = {
  name: 'actor',
};

describe('staffService', () => {
  let service: StaffService;
  let model: typeof Staff;

  beforeEach(async () => {
    const modRef = await Test.createTestingModule({
      providers: [
        StaffService,
        {
          provide: getModelToken(Staff),
          useValue: {
            findAll: jest.fn(() => [testStaff]),
            findOne: jest.fn(),
            create: jest.fn(() => testStaff),
            bulkCreate: jest.fn(() => testManyStaff),
            $set: jest.fn(),
            set: jest.fn(),
            count: jest.fn(),
          },
        },
        {
          provide: getModelToken(StaffType),
          useValue: {
            findAll: jest.fn(() => [testStaffType]),
            findOne: jest.fn(),
            create: jest.fn(() => testStaffType),
            bulkCreate: jest.fn(() => [testStaffType]),
            $set: jest.fn(),
            set: jest.fn(),
            count: jest.fn(),
          },
        },
      ],
    }).compile();

    service = modRef.get(StaffService);
    model = modRef.get<typeof Staff>(getModelToken(Staff));
  });

  it('should find all staff', async () => {
    expect(await service.findAll()).toEqual([testStaff]);
  });

  it('should find the staffs by names array', async () => {
    const saveStub = jest.fn();
    const findspy = jest.spyOn(model, 'findAll').mockReturnValue({
      save: saveStub,
    } as any);
    const names = ['Test 1', 'Test 2'];
    expect(await service.getStaffByNamesArray(names));
    expect(findspy).toBeCalledWith({
      where: {
        name: {
          [Op.or]: names,
        },
      },
    });
  });
});
