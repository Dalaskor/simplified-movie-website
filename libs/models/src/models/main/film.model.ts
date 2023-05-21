import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { Country } from './country.model';
import { FilmActors } from './film-actors.model';
import { FilmArtists } from './film-artists.model';
import { FilmCompositors } from './film-compositors.model';
import { FilmCountries } from './film-countires.model';
import { FilmDirectors } from './film-directors.model';
import { FilmGenres } from './film-genres.model';
import { FilmMontages } from './film-montages.model';
import { FilmOperators } from './film-operators.model';
import { FilmScenario } from './film-scenarios.model';
import { FilmSpectators } from './film-spectators.model';
import { Genre } from './genre.model';
import { Spectators } from './spectators.model';
import { Staff } from './staff.model';

interface FilmCreationAttrs {
  name: string;
  name_en: string;
  type: string;
  mainImg: string;
  year: number;
  tagline: string;
  budget: string;
  feesUS: string;
  feesRU: string;
  fees: string;
  premiere: string;
  premiereRU: string;
  releaseDVD: string;
  releaseBluRay: string;
  age: string;
  ratingMPAA: string;
  time: string;
  description: string;
}

@Table({ tableName: 'films' })
export class Film extends Model<Film, FilmCreationAttrs> {
  @ApiProperty({
    example: 1,
    description: 'ID фильма',
  })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: 'Хелсинг',
    description: 'Название фильма (на русском)',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @ApiProperty({
    example: 'Helsing',
    description: 'Название фильма (на английском)',
  })
  @Column({
    type: DataType.STRING,
  })
  name_en: string;

  @ApiProperty({
    example: 'фильм',
    description: 'Тип произведения',
  })
  @Column({
    type: DataType.STRING,
  })
  type: string;

  @ApiProperty({
    example:
      'https://m.media-amazon.com/images/M/MV5BODRmY2NhNDItOWViNi00OTIyLTk3YjYtYzY0YTFlMDg1YzQ0L2ltYWdlL2ltYWdlXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_FMjpg_UX1000_.jpg',
    description: 'URL адрес до изображения обложки фильма',
  })
  @Column({
    type: DataType.STRING,
  })
  mainImg: string;

  @ApiProperty({
    example: '2004',
    description: 'Год выпуска фильма',
  })
  @Column({
    type: DataType.INTEGER,
  })
  year: number;

  @ApiProperty({
    example: 'Хелсинг',
    description: 'Слоган фильма',
  })
  @Column({
    type: DataType.TEXT,
  })
  tagline: string;

  @ApiProperty({
    example: '1000000000 Руб.',
    description: 'Бюджет фильма',
  })
  @Column({
    type: DataType.STRING,
  })
  budget: string;

  @ApiProperty({
    example: '1000000000 Руб.',
    description: 'Сборы в мире',
  })
  @Column({
    type: DataType.STRING,
  })
  fees: string;

  @ApiProperty({
    example: '1000000000 Руб.',
    description: 'Сборы в США',
  })
  @Column({
    type: DataType.STRING,
  })
  feesUS: string;

  @ApiProperty({
    example: '1000000000 Руб.',
    description: 'Сборы в России',
  })
  @Column({
    type: DataType.STRING,
  })
  feesRU: string;

  @ApiProperty({
    example: '01.01.2004',
    description: 'Дата премьеры фильма в мире',
  })
  @Column({
    type: DataType.STRING,
  })
  premiere: string;

  @ApiProperty({
    example: '01.01.2004',
    description: 'Дата премьеры фильма в России',
  })
  @Column({
    type: DataType.STRING,
  })
  premiereRU: string;

  @ApiProperty({
    example: '01.01.2004',
    description: 'Дата релиза на DVD дисках',
  })
  @Column({
    type: DataType.STRING,
  })
  releaseDVD: string;

  @ApiProperty({
    example: '01.01.2004',
    description: 'Дата релиза на BluRay дисках',
  })
  @Column({
    type: DataType.STRING,
  })
  releaseBluRay: string;

  @ApiProperty({
    example: '16+',
    description: 'Возрастной рейтинг',
  })
  @Column({
    type: DataType.STRING,
  })
  age: string;

  @ApiProperty({
    example: 'PG-16',
    description: 'Возрастной рейтинг MPAA',
  })
  @Column({
    type: DataType.STRING,
  })
  ratingMPAA: string;

  @ApiProperty({
    example: '1ч 30мин',
    description: 'Длительность фильма',
  })
  @Column({
    type: DataType.STRING,
  })
  time: string;

  @ApiProperty({
    example: 'lorem ipsum',
    description: 'Описание фильма',
  })
  @Column({ type: DataType.TEXT })
  description: string;

  @ApiProperty({
    example: '7.5',
    description: 'Средняя оценка фильма (рейтинг)',
  })
  @Column({ type: DataType.FLOAT, allowNull: true })
  scoreAVG: number;

  @ApiProperty({
    example: '5000',
    description: 'Количество оценок фильма',
    default: 0,
  })
  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  countScore: number;

  @ApiProperty({
    example: [{ id: 1, name: 'Россия' }],
    type: Country,
    isArray: true,
    description: 'Странны, в которых снимали фильм',
  })
  @BelongsToMany(() => Country, () => FilmCountries)
  countries: Country[];

  @ApiProperty({
    example: [{ id: 1, name: 'комедия', name_en: 'comedy' }],
    type: Genre,
    isArray: true,
    description: 'Жанры фильма',
  })
  @BelongsToMany(() => Genre, () => FilmGenres)
  genres: Genre[];

  @ApiProperty({
    example: [{ id: 1, name: 'Райан Гослинг', biography: 'lorem ipsum' }],
    type: Staff,
    isArray: true,
    description: 'Операторы',
  })
  @BelongsToMany(() => Staff, () => FilmOperators)
  operators: Staff[];

  @ApiProperty({
    example: [{ id: 1, name: 'Райан Гослинг', biography: 'lorem ipsum' }],
    type: Staff,
    isArray: true,
    description: 'Композиторы',
  })
  @BelongsToMany(() => Staff, () => FilmCompositors)
  compositors: Staff[];

  @ApiProperty({
    example: [{ id: 1, name: 'Райан Гослинг', biography: 'lorem ipsum' }],
    type: Staff,
    isArray: true,
    description: 'Актеры',
  })
  @BelongsToMany(() => Staff, () => FilmActors)
  actors: Staff[];

  @ApiProperty({
    example: [{ id: 1, name: 'Райан Гослинг', biography: 'lorem ipsum' }],
    type: Staff,
    isArray: true,
    description: 'Художники',
  })
  @BelongsToMany(() => Staff, () => FilmArtists)
  artists: Staff[];

  @ApiProperty({
    example: [{ id: 1, name: 'Райан Гослинг', biography: 'lorem ipsum' }],
    type: Staff,
    isArray: true,
    description: 'Режисеры',
  })
  @BelongsToMany(() => Staff, () => FilmDirectors)
  directors: Staff[];

  @ApiProperty({
    example: [{ id: 1, name: 'Райан Гослинг', biography: 'lorem ipsum' }],
    type: Staff,
    isArray: true,
    description: 'Монтаж',
  })
  @BelongsToMany(() => Staff, () => FilmMontages)
  montages: Staff[];

  @ApiProperty({
    example: [{ id: 1, name: 'Райан Гослинг', biography: 'lorem ipsum' }],
    type: Staff,
    isArray: true,
    description: 'Сценаристы',
  })
  @BelongsToMany(() => Staff, () => FilmScenario)
  scenario: Staff[];

  @BelongsToMany(() => Spectators, () => FilmSpectators)
  spectators: Spectators[];
}
