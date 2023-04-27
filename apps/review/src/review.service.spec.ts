import { FILM_SERVICE } from '@app/common';
import { CreateReviewDto, Review } from '@app/models';
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
});
