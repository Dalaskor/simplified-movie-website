import { Test, TestingModule } from '@nestjs/testing';
import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';

describe('StaffController', () => {
  let staffController: StaffController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [StaffController],
      providers: [StaffService],
    }).compile();

    staffController = app.get<StaffController>(StaffController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(staffController.getHello()).toBe('Hello World!');
    });
  });
});
