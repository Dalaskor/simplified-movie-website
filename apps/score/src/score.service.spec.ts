import { FILM_SERVICE } from '@app/common';
import { CreateScoreDto, Score } from '@app/models';
import { UpdateScoreDto } from '@app/models/dtos/update-score.dto';
import { ClientProxy } from '@nestjs/microservices';
import { getModelToken } from '@nestjs/sequelize';
import { Test } from '@nestjs/testing';
import { ScoreService } from './score.service';

const testScore: CreateScoreDto = {
  value: 1,
  film_id: 1,
  user_id: 1,
};

const testUpdateScore: UpdateScoreDto = {
  value: 2,
  film_id: 1,
  user_id: 1,
};

describe('ScoreService', () => {
  let service: ScoreService;
  let model: typeof Score;
  let client: ClientProxy;

  beforeEach(async () => {
    const modRef = await Test.createTestingModule({
      providers: [
        ScoreService,
        {
          provide: getModelToken(Score),
          useValue: {
            findAll: jest.fn(() => [testScore]),
            findOne: jest.fn(),
            create: jest.fn(() => testScore),
            destroy: jest.fn(),
            count: jest.fn(() => 1),
          },
        },
        {
          provide: FILM_SERVICE,
          useValue: {
            send: jest.fn(),
          },
        },
      ],
    }).compile();

    service = modRef.get(ScoreService);
    model = modRef.get<typeof Score>(getModelToken(Score));
    client = modRef.get<ClientProxy>(FILM_SERVICE);
  });

  it('should create the score', async () => {
    expect(await service.create(testScore)).toEqual(testScore);
  });

  it('should update the score', async () => {
    const saveStub = jest.fn();
    const findSpy = jest.spyOn(model, 'findOne').mockReturnValue({
      save: saveStub,
    } as any);
    const retVal = await service.update(testUpdateScore);

    expect(findSpy).toBeCalledWith({
      where: {
        film_id: testUpdateScore.film_id,
        user_id: testUpdateScore.user_id,
      },
    });
    expect(saveStub).toBeCalledTimes(1);
  });

  it('should delete the score', async () => {
    const destroyStub = jest.fn();
    const findSpy = jest
      .spyOn(model, 'findOne')
      .mockReturnValue({ destroy: destroyStub } as any);
    const retVal = await service.delete({ film_id: 1, user_id: 1 });

    expect(findSpy).toBeCalledWith({ where: { film_id: 1, user_id: 1 } });
    expect(destroyStub).toBeCalledTimes(1);
    expect(retVal).toMatchObject({ message: 'Оценка удалена' });
  });
});
