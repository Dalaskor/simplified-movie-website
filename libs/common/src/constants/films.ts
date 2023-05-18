import { Film } from '@app/models';

export interface FilmPagResult {
  films: Film[];
  count: number;
  minScore: number;
  maxScore: number;
}
