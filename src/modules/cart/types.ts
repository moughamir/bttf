export type BttfEpisode = 1 | 2 | 3;

export type BttfCart = {
  readonly [K in BttfEpisode]: number;
};

export type ParseResult = {
  readonly bttf: BttfCart;
  readonly otherMovies: number;
};
