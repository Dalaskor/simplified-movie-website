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
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
  })
  name_en: string;

  @Column({
    type: DataType.STRING,
  })
  type: string;

  @Column({
    type: DataType.STRING,
  })
  mainImg: string;

  @Column({
    type: DataType.INTEGER,
  })
  year: number;

  @Column({
    type: DataType.TEXT,
  })
  tagline: string;

  @Column({
    type: DataType.STRING,
  })
  budget: string;

  @Column({
    type: DataType.STRING,
  })
  fees: string;

  @Column({
    type: DataType.STRING,
  })
  feesUS: string;

  @Column({
    type: DataType.STRING,
  })
  feesRU: string;

  @Column({
    type: DataType.STRING,
  })
  premiere: string;

  @Column({
    type: DataType.STRING,
  })
  premiereRU: string;

  @Column({
    type: DataType.STRING,
  })
  releaseDVD: string;

  @Column({
    type: DataType.STRING,
  })
  releaseBluRay: string;

  @Column({
    type: DataType.STRING,
  })
  age: string;

  @Column({
    type: DataType.STRING,
  })
  ratingMPAA: string;

  @Column({
    type: DataType.STRING,
  })
  time: string;

  @Column({ type: DataType.TEXT })
  description: string;

  @Column({ type: DataType.FLOAT, allowNull: true })
  scoreAVG: number;

  @Column({type: DataType.INTEGER, defaultValue: 0})
  countScore: number;

  @BelongsToMany(() => Country, () => FilmCountries)
  countries: Country[];

  @BelongsToMany(() => Genre, () => FilmGenres)
  genres: Genre[];

  @BelongsToMany(() => Staff, () => FilmOperators)
  operators: Staff[];

  @BelongsToMany(() => Staff, () => FilmCompositors)
  compositors: Staff[];

  @BelongsToMany(() => Staff, () => FilmActors)
  actors: Staff[];

  @BelongsToMany(() => Staff, () => FilmArtists)
  artists: Staff[];

  @BelongsToMany(() => Staff, () => FilmDirectors)
  directors: Staff[];

  @BelongsToMany(() => Staff, () => FilmMontages)
  montages: Staff[];

  @BelongsToMany(() => Staff, () => FilmScenario)
  scenario: Staff[];

  @BelongsToMany(() => Spectators, () => FilmSpectators)
  spectators: Spectators[];
}
