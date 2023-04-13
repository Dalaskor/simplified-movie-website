import { Test, TestingModule } from '@nestjs/testing';
import { CountryController } from './country.controller';
import { CountryService } from './country.service';

describe('CountryController', () => {
  let countryController: CountryController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CountryController],
      providers: [CountryService],
    }).compile();

    countryController = app.get<CountryController>(CountryController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(countryController.getHello()).toBe('Hello World!');
    });
  });
});
