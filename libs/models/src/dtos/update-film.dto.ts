import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateFilmDto } from './create-film.dto';

export class UpdateFilmDto extends PartialType(CreateFilmDto) {
  @ApiProperty({
    example: 1,
    description: 'Идентификатор фильма в базе данных',
  })
  @IsInt({ message: 'id Должно быть целым числом' })
  id: number;

  @ApiProperty({
    example: 'Король и Шут',
    description: 'Название фильма на русском',
  })
  @IsOptional()
  @IsString({ message: 'name должно быть строкой' })
  name?: string;

  @ApiProperty({
    example: 'King and Jester',
    description: 'Название фильма на английском',
  })
  @IsOptional()
  @IsString({ message: 'name_en Должно быть строкой' })
  name_en?: string;

  @ApiProperty({
    example: 'сериал',
    description: 'Тип произведения (фильм, сериал)',
  })
  @IsOptional()
  @IsString({ message: 'type Должно быть строкой' })
  type?: string;

  @ApiProperty({
    example: '2023',
    description: 'Год выпуска',
  })
  @IsOptional()
  @IsInt({ message: 'year Должно быть целым числом' })
  year?: number;

  @ApiProperty({
    example: 'Россия',
    description: 'Страна произведения',
  })
  @IsOptional()
  @IsString({
    message: 'элемент массива country Должно быть строкой',
    each: true,
  })
  country?: string[];

  @ApiProperty({
    example: '["музыка", "биография", "драма"]',
    description: 'Жанр произведения',
  })
  @IsOptional()
  @IsString({
    message: 'элемент массива genre Должно быть строкой',
    each: true,
  })
  genre?: string[];

  @ApiProperty({
    example: 'Lorem ipsum sit amet',
    description: 'Слоган произведения',
  })
  @IsOptional()
  @IsString({ message: 'tagline Должно быть строкой' })
  tagline?: string;

  @ApiProperty({
    example: '["Рустам Мосафир"]',
    description: 'Директора',
  })
  @IsOptional()
  @IsString({
    message: 'элемент массива director Должно быть строкой',
    each: true,
  })
  director?: string[];

  @ApiProperty({
    example: '["Дмитрий Лемешев", "Рустам Мосафир", "Александр Бузин"]',
    description: 'Сценаристы',
  })
  @IsOptional()
  @IsString({
    message: 'элемент массива scenario Должно быть строкой',
    each: true,
  })
  scenario?: string[];

  @ApiProperty({
    example: '["Дмитрий Нелидов", "Александра Ремизова", "Ольга Филипук"]',
    description: 'Продюсеры',
  })
  @IsOptional()
  @IsString({
    message: 'элемент массива producer Должно быть строкой',
    each: true,
  })
  producer?: string[];

  @ApiProperty({
    example: '["Степан Бешкуров"]',
    description: 'Операторы',
  })
  @IsOptional()
  @IsString({
    message: 'элемент массива operator Должно быть строкой',
    each: true,
  })
  operator?: string[];

  @ApiProperty({
    example: '["Алексей Горшенев"]',
    description: 'Композиторы',
  })
  @IsOptional()
  @IsString({
    message: 'элемент массива compositor Должно быть строкой',
    each: true,
  })
  compositor?: string[];

  @ApiProperty({
    example: '["Григорий Пушкин", "Оксана Кручина", "Макр Ли"]',
    description: 'Художники',
  })
  @IsOptional()
  @IsString({
    message: 'элемент массива artist Должно быть строкой',
    each: true,
  })
  artist?: string[];

  @ApiProperty({
    example: '["Андрей Назаров"]',
    description: 'Монтаж',
  })
  @IsOptional()
  @IsString({
    message: 'элемент массива montage Должно быть строкой',
    each: true,
  })
  montage?: string[];

  @ApiProperty({
    example: '["Константин Плотников", "Влад Коноплёв"]',
    description: 'Актеры',
  })
  @IsOptional()
  @IsString({
    message: 'элемент массива actors Должно быть строкой',
    each: true,
  })
  actors?: string[];

  @ApiProperty({
    example: '€9 500 000',
    description: 'Бюджет',
  })
  @IsOptional()
  @IsString({ message: 'budget Должно быть строкой' })
  budget?: string;

  @ApiProperty({
    example: '$10 198 820',
    description: 'Сборы в США',
  })
  @IsOptional()
  @IsString({ message: 'feesUS Должно быть строкой' })
  feesUS?: string;

  @ApiProperty({
    example: '+ $416 389 690 = $426 588 510',
    description: 'Сборы в Мире',
  })
  @IsOptional()
  @IsString({ message: 'fees Должно быть строкой' })
  fees?: string;

  @ApiProperty({
    example: '$1 725 813',
    description: 'Сборы в России',
  })
  @IsOptional()
  @IsString({ message: 'feesRU Должно быть строкой' })
  feesRU?: string;

  @ApiProperty({
    example: '26 апреля 2012',
    description: 'Премьера в России',
  })
  @IsOptional()
  @IsString({ message: 'premiereRU Должно быть строкой' })
  premiereRU?: string;

  @ApiProperty({
    example: '23 сентября 2011',
    description: 'Премьера в мире',
  })
  @IsOptional()
  @IsString({ message: 'premiere Должно быть строкой' })
  premiere?: string;

  @ApiProperty({
    example: '28 мая 2012, «Новый Диск»',
    description: 'Релиз на DVD',
  })
  @IsOptional()
  @IsString({ message: 'releaseDVD Должно быть строкой' })
  releaseDVD?: string;

  @ApiProperty({
    example: '25 июня 2012, «Новый Диск»',
    description: 'Релиз на Blue-ray',
  })
  @IsOptional()
  @IsString({ message: 'releaseBluRay Должно быть строкой' })
  releaseBluRay?: string;

  @ApiProperty({
    example: '16+',
    description: 'Возрастной рейтинг',
  })
  @IsOptional()
  @IsString({ message: 'age Должно быть строкой' })
  age?: string;

  @ApiProperty({
    example: 'R',
    description: 'Рейтинг MPAA',
  })
  @IsOptional()
  @IsString({ message: 'reatingMPAA Должно быть строкой' })
  ratingMPAA?: string;

  @ApiProperty({
    example: '112 мин. / 01:52',
    description: 'Время',
  })
  @IsOptional()
  @IsString({ message: 'time Должно быть строкой' })
  time?: string;

  @ApiProperty({
    example: 'Lorem ipsum sit amet',
    description: 'Описание',
  })
  @IsOptional()
  @IsString({ message: 'description Должно быть строкой' })
  description?: string;

  @ApiProperty({
    example: 'https://www.images.ru/film-img',
    description: 'URL обложки фильма',
  })
  @IsOptional()
  @IsString({ message: 'mainImg Должно быть строкой' })
  mainImg?: string;
}
