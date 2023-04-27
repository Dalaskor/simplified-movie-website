import { CreateReviewDto } from '@app/models';
import { Test } from '@nestjs/testing';
import { ReviewController } from './review.controller';
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

interface ReviewData {
    film_id: number;
    user_id: number;
}

describe('ReviewController', () => {
    let controller: ReviewController;
    let service: ReviewService;

    beforeEach(async () => {
        const modRef = await Test.createTestingModule({
            controllers: [ReviewController],
            providers: [
                {
                    provide: ReviewService,
                    useValue: {
                        create: jest.fn(() => testReview),
                        update: jest
                            .fn()
                            .mockImplementation((dto: CreateReviewDto) =>
                                Promise.resolve({
                                    id: 1,
                                    text: dto.text,
                                    film_id: dto.film_id,
                                    user_id: dto.user_id,
                                }),
                            ),
                        delete: jest.fn(),
                        getOne: jest
                            .fn()
                            .mockImplementation(
                                (film_id: number, user_id: number) =>
                                    Promise.resolve({
                                        id: 1,
                                        text: 'Test',
                                        film_id,
                                        user_id,
                                    }),
                            ),
                        getAllByFilm: jest
                            .fn()
                            .mockImplementation((film_id: number) =>
                                Promise.resolve([
                                    {
                                        id: 1,
                                        text: 'Test',
                                        user_id: 1,
                                        film_id,
                                    },
                                ]),
                            ),
                        getAllByUser: jest
                            .fn()
                            .mockImplementation((user_id: number) =>
                                Promise.resolve([
                                    {
                                        id: 1,
                                        text: 'Test',
                                        film_id: 1,
                                        user_id,
                                    },
                                ]),
                            ),
                        deleteAllByFilm: jest.fn(),
                        getCountByFilm: jest
                            .fn()
                            .mockImplementation(() => Promise.resolve(1)),
                    },
                },
            ],
        }).compile();

        controller = modRef.get(ReviewController);
        service = modRef.get<ReviewService>(ReviewService);
    });

    it('should create the review', async () => {
        expect(await controller.create(testCreateReviewDto)).toEqual(
            testReview,
        );
    });

    it('should update the review', async () => {
        await controller.update(testCreateReviewDto);
        expect(service.update).toHaveBeenCalled();
        expect(controller.update(testCreateReviewDto)).resolves.toEqual({
            id: 1,
            text: testCreateReviewDto.text,
            film_id: testCreateReviewDto.film_id,
            user_id: testCreateReviewDto.user_id,
        });
    });

    it('should remove the review', async () => {
        await controller.delete({ film_id: 1, user_id: 1 });
        expect(service.delete).toHaveBeenCalled();
    });

    it('should find one review', async () => {
        const reviewData: ReviewData = { film_id: 1, user_id: 1 };
        await controller.getOne(reviewData);
        expect(service.getOne).toHaveBeenCalled();
        expect(controller.getOne(reviewData)).resolves.toEqual({
            id: 1,
            text: 'Test',
            user_id: reviewData.user_id,
            film_id: reviewData.film_id,
        });
    });

    it('should find all reviews for film', async () => {
        await controller.getAllByFilm(1);
        expect(service.getAllByFilm).toHaveBeenCalled();
        expect(controller.getAllByFilm(1)).resolves.toEqual([
            {
                id: 1,
                text: 'Test',
                user_id: 1,
                film_id: 1,
            },
        ]);
    });

    it('should find all reviews for user', async () => {
        await controller.getAllByUser(1);
        expect(service.getAllByUser).toHaveBeenCalled();
        expect(controller.getAllByUser(1)).resolves.toEqual([
            {
                id: 1,
                text: 'Test',
                user_id: 1,
                film_id: 1,
            },
        ]);
    });

    it('should delete all reviews by film id', async () => {
        await controller.deleteAllByFilm(1);
        expect(service.deleteAllByFilm).toHaveBeenCalled();
    });

    it('should get count of reviews for film', async () => {
        await controller.getCountByFilm(1);
        expect(service.getCountByFilm).toHaveBeenCalled();
    });
});
