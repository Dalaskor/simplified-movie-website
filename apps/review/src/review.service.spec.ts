import { FILM_SERVICE } from '@app/common';
import { CreateReviewDto, Review } from '@app/models';
import { HttpStatus } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { getModelToken } from '@nestjs/sequelize';
import { Test } from '@nestjs/testing';
import { ReviewService } from './review.service';

const testReview = {
    text: 'Test',
    user_id: 1,
    film_id: 1,
};

const testCreateReviewDto: CreateReviewDto = {
    text: 'Test',
    user_id: 1,
    film_id: 1,
};

describe('ReviewService', () => {
    let service: ReviewService;
    let model: typeof Review;
    let client: ClientProxy;

    beforeEach(async () => {
        const modRef = await Test.createTestingModule({
            providers: [
                ReviewService,
                {
                    provide: getModelToken(Review),
                    useValue: {
                        findAll: jest.fn(() => [testReview]),
                        findOne: jest.fn(),
                        create: jest.fn(() => testReview),
                        destroy: jest.fn(),
                        count: jest.fn(),
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

        service = modRef.get(ReviewService);
        model = modRef.get<typeof Review>(getModelToken(Review));
        client = modRef.get<ClientProxy>(FILM_SERVICE);
    });

    it('should create the review', async () => {
        expect(await service.create(testCreateReviewDto)).toEqual(testReview);
    });

    it('should delete the review', async () => {
        const destroyStub = jest.fn();
        const findSpy = jest
            .spyOn(model, 'findOne')
            .mockReturnValue({ destroy: destroyStub } as any);
        const retVal = await service.delete(1, 1);

        expect(findSpy).toBeCalledWith({ where: { film_id: 1, user_id: 1 } });
        expect(destroyStub).toBeCalledTimes(1);
        expect(retVal).toMatchObject({
            statusCode: HttpStatus.OK,
            message: 'Отзыв удален',
        });
    });

    it('should find the review', async () => {
        const saveStub = jest.fn();
        const findspy = jest.spyOn(model, 'findOne').mockReturnValue({
            save: saveStub,
        } as any);
        expect(await service.getOne(1, 1));
        expect(findspy).toBeCalledWith({ where: { film_id: 1, user_id: 1 } });
    });

    it('should find all reviews for film', async () => {
        const saveStub = jest.fn();
        const findspy = jest.spyOn(model, 'findAll').mockReturnValue({
            save: saveStub,
        } as any);
        expect(await service.getAllByFilm(1));
        expect(findspy).toBeCalledWith({ where: { film_id: 1 } });
    });

    it('should find all reviews for user', async () => {
        const saveStub = jest.fn();
        const findspy = jest.spyOn(model, 'findAll').mockReturnValue({
            save: saveStub,
        } as any);
        expect(await service.getAllByUser(1));
        expect(findspy).toBeCalledWith({ where: { user_id: 1 } });
    });
});
