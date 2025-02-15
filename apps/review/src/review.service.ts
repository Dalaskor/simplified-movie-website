import { AUTH_SERVICE, FILM_SERVICE } from '@app/common';
import {
  CreateReviewDto,
  OutputReviewDto,
  Review,
  UpdateReviewDto,
  User,
} from '@app/models';
import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/sequelize';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review) private reviewRepository: typeof Review,
    @Inject(FILM_SERVICE) private filmClient: ClientProxy,
    @Inject(AUTH_SERVICE) private authClient: ClientProxy,
  ) {}

  /**
   * Создать отзыв.
   * @param {CreateReviewDto} dto - DTO для создания отзыва.
   * @returns Review - Созданный отзыв.
   * @throws BadRequestException
   */
  async create(dto: CreateReviewDto): Promise<OutputReviewDto> {
    await this.checkFilm(dto.film_id);
    const commentUser: User = await lastValueFrom(
      this.authClient.send('getUser', dto.user_id),
    );
    if (!commentUser) {
      console.log('testing');
      throw new RpcException(new NotFoundException('Пользователь не найден'));
    }
    const review = await this.reviewRepository.create(dto);
    if (!review) {
      throw new RpcException(new BadRequestException('Ошибка создания отзыва'));
    }
    return {
      id: review.id,
      text: review.text,
      user_id: review.user_id,
      film_id: review.film_id,
      parent: review.parent,
      user_email: commentUser.email,
      createdAt: review.createdAt,
    };
  }
  async checkFilm(film_id: number) {
    return this.filmClient.send('checkFilmExistById', film_id);
  }

  /**
   * Обновить данные отзыва.
   * @param {CreateReviewDto} dto - DTO создания для отзыва.
   * @returns Review - Обновленный отзыв.
   * @throws NotFoundException
   */
  async update(dto: UpdateReviewDto): Promise<Review> {
    const review = await this.reviewRepository.findByPk(dto.id);

    if (!review) {
      throw new RpcException(new NotFoundException('Отзыв не найден'));
    }

    review.set('text', dto.text);

    await review.save();

    return review;
  }

  /**
   * Удалить отзыв.
   * @param {number} id - Идентификатор коментария.
   * который написал отзыв.
   * @returns Результат удаления отзыва.
   * @throws NotFoundException
   */
  async delete(id: number): Promise<any> {
    const review = await this.reviewRepository.findByPk(id);

    if (!review) {
      throw new RpcException(new NotFoundException('Отзыв не найден'));
    }

    await review.destroy();

    return { statusCode: HttpStatus.OK, message: 'Отзыв удален' };
  }

  /**
   * Получить один отзыв.
   * @param {number} id - Идентификатор отзыва.
   * который написал отзыв.
   * @returns Review - Найденный отзыв.
   * @throws NotFoundException
   */
  async getOne(id: number): Promise<OutputReviewDto> {
    const review = await this.reviewRepository.findByPk(id);

    if (!review) {
      throw new RpcException(new NotFoundException('Отзыв не найден'));
    }

    const commentUser: User = await lastValueFrom(
      this.authClient.send('getUser', review.user_id),
    );

    if (!commentUser) {
      throw new RpcException(new NotFoundException('Пользователь не найден'));
    }

    return {
      id: review.id,
      text: review.text,
      user_id: review.user_id,
      film_id: review.film_id,
      parent: review.parent,
      user_email: commentUser.email,
      user_name: commentUser.name,
      createdAt: review.createdAt,
    };
  }

  /**
   * Получить все отзывы на фильм.
   * @param {number} film_id - Идентификатор фильма.
   * @returns Review[] - Список найденных отзывов.
   */
  async getAllByFilm(film_id: number): Promise<OutputReviewDto[]> {
    const reviews = await this.reviewRepository.findAll({
      where: { film_id },
      order: [['createdAt', 'DESC']],
    });

    const outputs: OutputReviewDto[] = [];
    for await (const review of reviews) {
      const commentUser: User = await lastValueFrom(
        this.authClient.send('getUser', review.user_id),
      );

      if (!commentUser) {
        continue;
        // throw new RpcException(new NotFoundException('Пользователь не найден'));
      }

      outputs.push({
        id: review.id,
        text: review.text,
        user_id: review.user_id,
        film_id: review.film_id,
        parent: review.parent,
        user_email: commentUser.email,
        user_name: commentUser.name,
        createdAt: review.createdAt,
      });
    }

    return outputs;
  }

  /**
   * Получить все отзывы пользователя.
   * @param {number} user_id - Идентификатор пользователя.
   * @returns Review[] - Список найденных отзывов.
   */
  async getAllByUser(user_id: number): Promise<OutputReviewDto[]> {
    const commentUser: User = await lastValueFrom(
      this.authClient.send('getUser', user_id),
    );
    if (!commentUser) {
      throw new RpcException(new NotFoundException('Пользователь не найден'));
    }
    const reviews = await this.reviewRepository.findAll({
      where: { user_id },
      order: [['createdAt', 'DESC']],
    });

    const outputs: OutputReviewDto[] = [];
    for (const review of reviews) {
      outputs.push({
        id: review.id,
        text: review.text,
        user_id: review.user_id,
        film_id: review.film_id,
        parent: review.parent,
        user_email: commentUser.email,
        user_name: commentUser.name,
        createdAt: review.createdAt,
      });
    }

    return outputs;
  }

  /**
   * Удалить все отзывы к фильму.
   * @param {number} film_id - Идентификатор фильма.
   * @returns number - Количество удаленных отзывов.
   */
  async deleteAllByFilm(film_id: number): Promise<number> {
    const count = await this.reviewRepository.destroy({ where: { film_id } });
    return count;
  }

  /**
   * Получить количество отзывов к фильму.
   * @param {number} film_id - Идентификатор фильма.
   * @returns number - Количество отзывов к фильму.
   */
  async getCountByFilm(film_id: number): Promise<number> {
    return await this.reviewRepository.count({ where: { film_id } });
  }

  /**
   * Получить все дочерние коментарии.
   * @param {number} film_id - Идентификатор фильма.
   * @param {number} parent_id - Идентификатор родителя
   */
  async getAllReviewsByParent(
    film_id: number,
    parent_id: number,
  ): Promise<OutputReviewDto[]> {
    const reviews = await this.reviewRepository.findAll({
      where: { film_id, parent: parent_id },
      order: [['createdAt', 'DESC']],
    });
    const outputs: OutputReviewDto[] = [];
    for await (const review of reviews) {
      const commentUser: User = await lastValueFrom(
        this.authClient.send('getUser', review.user_id),
      );

      if (!commentUser) {
        continue;
        // throw new RpcException(new NotFoundException('Пользователь не найден'));
      }

      outputs.push({
        id: review.id,
        text: review.text,
        user_id: review.user_id,
        film_id: review.film_id,
        parent: review.parent,
        user_email: commentUser.email,
        user_name: commentUser.name,
        createdAt: review.createdAt,
      });
    }
    return outputs;
  }

  async getAllFilmReviewsOnlyParent(
    film_id: number,
  ): Promise<OutputReviewDto[]> {
    const reviews = await this.reviewRepository.findAll({
      where: { film_id, parent: null },
      order: [['createdAt', 'DESC']],
    });
    const outputs: OutputReviewDto[] = [];
    for await (const review of reviews) {
      const commentUser: User = await lastValueFrom(
        this.authClient.send('getUser', review.user_id),
      );
      if (!commentUser) {
        continue;
        // throw new RpcException(new NotFoundException('Пользователь не найден'));
      }
      outputs.push({
        id: review.id,
        text: review.text,
        user_id: review.user_id,
        film_id: review.film_id,
        parent: review.parent,
        user_email: commentUser.email,
        user_name: commentUser.name,
        createdAt: review.createdAt,
      });
    }
    return outputs;
  }
}
