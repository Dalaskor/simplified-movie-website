import { Test, TestingModule } from '@nestjs/testing';
import { PageController } from './page.controller';
import { PageService } from './page.service';

describe('PageController', () => {
  let pageController: PageController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PageController],
      providers: [PageService],
    }).compile();

    pageController = app.get<PageController>(PageController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(pageController.getHello()).toBe('Hello World!');
    });
  });
});
