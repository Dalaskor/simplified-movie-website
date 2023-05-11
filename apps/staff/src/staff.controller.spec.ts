import { CreateStaffDto, UpdateStaffDto } from '@app/models';
import { Test } from '@nestjs/testing';
import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';

const testStaff = {
  id: 1,
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

const testCreateStaffDto: CreateStaffDto = {
  name: 'Test',
  types: ['actor'],
};

const testCreateManyStaffDto: CreateStaffDto[] = [
  {
    name: 'Test 1',
    types: ['actor'],
  },
  {
    name: 'Test 2',
    types: ['actor'],
  },
];

const testUpdateStaffDto: UpdateStaffDto = {
  id: 1,
  name: 'New Test',
  types: ['actor'],
};

describe('StaffController', () => {
  let controller: StaffController;
  let service: StaffService;

  beforeEach(async () => {
    const modRef = await Test.createTestingModule({
      controllers: [StaffController],
      providers: [
        {
          provide: StaffService,
          useValue: {
            createMany: jest.fn(() => testManyStaff),
            create: jest.fn(() => testStaff),
            findAll: jest.fn(() => [testStaff]),
            findOne: jest.fn().mockImplementation((id: number) =>
              Promise.resolve({
                id,
                name: 'Test',
                types: ['actor'],
              }),
            ),
            findByname: jest.fn().mockImplementation((name: string) =>
              Promise.resolve({
                id: 1,
                name,
                types: ['actor'],
              }),
            ),
            getStaffByNamesArray: jest
              .fn()
              .mockImplementation((names: string[]) =>
                Promise.resolve([
                  {
                    id: 1,
                    name: names[0],
                    types: ['actor'],
                  },
                  {
                    id: 2,
                    name: names[1],
                    types: ['actor'],
                  },
                ]),
              ),
            update: jest
              .fn()
              .mockImplementation((id: number, dto: UpdateStaffDto) =>
                Promise.resolve({
                  id,
                  name: dto.name,
                  types: dto.types,
                }),
              ),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = modRef.get(StaffController);
    service = modRef.get<StaffService>(StaffService);
  });

  it('should create many staffs', async () => {
    expect(await controller.createMany(testCreateManyStaffDto)).toEqual(
      testManyStaff,
    );
  });

  it('should create the staff', async () => {
    expect(await controller.create(testCreateStaffDto)).toEqual(testStaff);
  });

  it('should find all staffs', async () => {
    expect(await controller.findAll()).toEqual([testStaff]);
  });

  it('should find the staff by id', async () => {
    await controller.findOne(1);
    expect(service.findOne).toHaveBeenCalled();
    expect(controller.findOne(1)).resolves.toEqual({
      id: 1,
      name: 'Test',
      types: ['actor'],
    });
  });

  it('should update the staff', async () => {
    await controller.update(testUpdateStaffDto);
    expect(service.update).toHaveBeenCalled();
    expect(controller.update(testUpdateStaffDto)).resolves.toEqual({
      id: testUpdateStaffDto.id,
      name: testUpdateStaffDto.name,
      types: testUpdateStaffDto.types,
    });
  });

  it('should remove the staff', async () => {
    await controller.remove(1);
    expect(service.remove).toHaveBeenCalled();
  });

  it('should get the staffs by names array', async () => {
    const names: string[] = ['Test 1', 'Test 2'];
    await controller.getStaffByNamesHandle(names);
    expect(service.getStaffByNamesArray).toHaveBeenCalled();
    expect(controller.getStaffByNamesHandle(names)).resolves.toEqual([
      {
        id: 1,
        name: names[0],
        types: ['actor'],
      },
      {
        id: 2,
        name: names[1],
        types: ['actor'],
      },
    ]);
  });
});
