import { Test, TestingModule } from '@nestjs/testing';
import { ScoreController } from './score.controller';
import { ScoreService } from './score.service';

describe('ScoreController', () => {
  let scoreController: ScoreController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ScoreController],
      providers: [ScoreService],
    }).compile();

    scoreController = app.get<ScoreController>(ScoreController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(scoreController.getHello()).toBe('Hello World!');
    });
  });
});
