export type BttfEpisode = 1 | 2 | 3;

export type BttfCart = {
  [K in BttfEpisode]: number;
};

export type ParseResult = {
  bttf: BttfCart;
  otherMovies: number;
};

export interface BttfDiscountInfo {
  totalQuantity: number;
  distinctEpisodes: number;
  discountRate: number;
  baseCost: number;
  savings: number;
}

export interface Example {
  label: string;
  value: string;
}

export interface CartPriceResult {
  price: number;
  bttf: BttfCart;
  otherMovies: number;
}
