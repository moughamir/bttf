import {
  BTTF_BASE_PRICE,
  DISCOUNT_TABLE,
  MOVIE_STANDARD_PRICE,
} from "./constants";
import type { BttfCart, BttfDiscountInfo } from "./types";

export function getBttfDiscountInfo(bttf: BttfCart): BttfDiscountInfo {
  const totalQuantity = Object.values(bttf).reduce((sum, qty) => sum + qty, 0);
  const distinctEpisodes = Object.values(bttf).filter((qty) => qty > 0).length;
  const discountRate = DISCOUNT_TABLE[distinctEpisodes] ?? 1.0;
  const baseCost = BTTF_BASE_PRICE * totalQuantity;
  const savings = Math.round(baseCost * (1 - discountRate));

  return { totalQuantity, distinctEpisodes, discountRate, baseCost, savings };
}

export function calculateCartTotal(
  bttf: BttfCart,
  otherMoviesCount: number,
): number {
  const { baseCost, discountRate } = getBttfDiscountInfo(bttf);
  const bttfTotalCost = baseCost * discountRate;
  const standardTotalCost = MOVIE_STANDARD_PRICE * otherMoviesCount;

  return bttfTotalCost + standardTotalCost;
}
