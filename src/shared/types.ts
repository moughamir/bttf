export type BttfEpisode = 1 | 2 | 3;
export type BttfBasket = {
  readonly [K in BttfEpisode]: number;
};
export type ParseResult = {
  readonly bttf: BttfBasket;
  readonly otherMovies: number;
};
