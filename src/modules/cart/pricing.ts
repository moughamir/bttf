import { BTTF_BASE_PRICE, DISCOUNT_TABLE, MOVIE_STANDARD_PRICE } from "./constants";
import type { BttfCart } from "./types";

export function calculateCartTotal(
  bttf: BttfCart,
  otherMoviesCount: number,
): number {
  const totalBttf = Object.values(bttf).reduce((sum, qty) => sum + qty, 0);
  const distinctBttf = Object.values(bttf).filter((qty) => qty > 0).length;
  const bttfDiscount = DISCOUNT_TABLE[distinctBttf] ?? 1.0;
  const bttfTotalCost = BTTF_BASE_PRICE * totalBttf * bttfDiscount;
  const standardTotalCost = MOVIE_STANDARD_PRICE * otherMoviesCount;

  return bttfTotalCost + standardTotalCost;
}
