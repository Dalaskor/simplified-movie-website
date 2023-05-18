import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsInt, IsString, ValidateNested } from 'class-validator';

export class CreateFilmDto {
  @ApiProperty({
    example: 'Король и Шут',
    description: 'Название фильма на русском',
  })
  @IsString({ message: 'Должно быть строкой' })
  name: string;

  @ApiProperty({
    example: 'King and Jester',
    description: 'Название фильма на английском',
  })
  @IsString({ message: 'Должно быть строкой' })
  name_en: string;

  @ApiProperty({
    example: 'сериал',
    description: 'Тип произведения (фильм, сериал)',
  })
  @IsString({ message: 'Должно быть строкой' })
  type: string;

  @ApiProperty({
    example: '2023',
    description: 'Год выпуска',
  })
  @IsInt({ message: 'Должно быть целым числом' })
  year: number;

  @ApiProperty({
    example: 'Россия',
    description: 'Страна произведения',
    isArray: true,
  })
  @IsString({ message: 'Должно быть строкой', each: true })
  country: string[];

  @ApiProperty({
    example: '["музыка", "биография", "драма"]',
    description: 'Жанр произведения',
    isArray: true,
  })
  @IsString({ message: 'Должно быть строкой', each: true })
  genre: string[];

  @ApiProperty({
    example: 'Lorem ipsum sit amet',
    description: 'Слоган произведения',
  })
  @IsString({ message: 'Должно быть строкой' })
  tagline: string;

  @ApiProperty({
    example: '["Рустам Мосафир"]',
    description: 'Режисеры',
    isArray: true,
  })
  @IsString({ message: 'Должно быть строкой', each: true })
  director: string[];

  @ApiProperty({
    example: '["Дмитрий Лемешев", "Рустам Мосафир", "Александр Бузин"]',
    description: 'Сценаристы',
    isArray: true,
  })
  @IsString({ message: 'Должно быть строкой', each: true })
  scenario: string[];

  @ApiProperty({
    example: '["Дмитрий Нелидов", "Александра Ремизова", "Ольга Филипук"]',
    description: 'Продюсеры',
    isArray: true,
  })
  @IsString({ message: 'Должно быть строкой', each: true })
  producer: string[];

  @ApiProperty({
    example: '["Степан Бешкуров"]',
    description: 'Операторы',
    isArray: true,
  })
  @IsString({ message: 'Должно быть строкой', each: true })
  operator: string[];

  @ApiProperty({
    example: '["Алексей Горшенев"]',
    description: 'Композиторы',
    isArray: true,
  })
  @IsString({ message: 'Должно быть строкой', each: true })
  compositor: string[];

  @ApiProperty({
    example: '["Григорий Пушкин", "Оксана Кручина", "Макр Ли"]',
    description: 'Художники',
    isArray: true,
  })
  @IsString({ message: 'Должно быть строкой', each: true })
  artist: string[];

  @ApiProperty({
    example: '["Андрей Назаров"]',
    description: 'Монтаж',
    isArray: true,
  })
  @IsString({ message: 'Должно быть строкой', each: true })
  montage: string[];

  @ApiProperty({
    example: '["Константин Плотников", "Влад Коноплёв"]',
    description: 'Актеры',
    isArray: true,
  })
  @IsString({ message: 'Должно быть строкой', each: true })
  actors: string[];

  @ApiProperty({
    example: '€9 500 000',
    description: 'Бюджет',
  })
  @IsString({ message: 'Должно быть строкой' })
  budget: string;

  @ApiProperty({
    example: '$10 198 820',
    description: 'Сборы в США',
  })
  @IsString({ message: 'Должно быть строкой' })
  feesUS: string;

  @ApiProperty({
    example: '+ $416 389 690 = $426 588 510',
    description: 'Сборы в Мире',
  })
  @IsString({ message: 'Должно быть строкой' })
  fees: string;

  @ApiProperty({
    example: '$1 725 813',
    description: 'Сборы в России',
  })
  @IsString({ message: 'Должно быть строкой' })
  feesRU: string;

  @ApiProperty({
    example: '26 апреля 2012',
    description: 'Премьера в России',
  })
  @IsString({ message: 'Должно быть строкой' })
  premiereRU: string;

  @ApiProperty({
    example: '23 сентября 2011',
    description: 'Премьера в мире',
  })
  @IsString({ message: 'Должно быть строкой' })
  premiere: string;

  @ApiProperty({
    example: '28 мая 2012, «Новый Диск»',
    description: 'Релиз на DVD',
  })
  @IsString({ message: 'Должно быть строкой' })
  releaseDVD: string;

  @ApiProperty({
    example: '25 июня 2012, «Новый Диск»',
    description: 'Релиз на Blue-ray',
  })
  @IsString({ message: 'Должно быть строкой' })
  releaseBluRay: string;

  @ApiProperty({
    example: '16+',
    description: 'Возрастной рейтинг',
  })
  @IsString({ message: 'Должно быть строкой' })
  age: string;

  @ApiProperty({
    example: 'R',
    description: 'Рейтинг MPAA',
  })
  @IsString({ message: 'Должно быть строкой' })
  ratingMPAA: string;

  @ApiProperty({
    example: '112 мин. / 01:52',
    description: 'Время',
  })
  @IsString({ message: 'Должно быть строкой' })
  time: string;

  @ApiProperty({
    example: 'Lorem ipsum sit amet',
    description: 'Описание',
  })
  @IsString({ message: 'Должно быть строкой' })
  description: string;

  @ApiProperty({
    example: 'https://www.images.ru/film-img',
    description: 'URL обложки фильма',
  })
  @IsString({ message: 'Должно быть строкой' })
  mainImg: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Spectator)
  spectators: Spectator[];

  countScore?: number;
}

class Spectator {
  country: string;
  count: string;
}
