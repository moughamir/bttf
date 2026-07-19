import { describe, test, expect } from "bun:test";
import type { BttfBasket } from "@/shared/types";
import { calculateBasketTotal } from "./pricing";

const emptyBasket: BttfBasket = { 1: 0, 2: 0, 3: 0 };

describe("calculateBasketTotal", () => {
  test("Empty Basket = 0", () => {
    expect(calculateBasketTotal(emptyBasket, 0)).toBe(0);
  });
  test("single BTTF episode = 15", () => {
    expect(
      calculateBasketTotal(
        {
          1: 1,
          2: 0,
          3: 0,
        },
        0,
      ),
    ).toBe(15);
  });
  test("two copies of same episode = 30 (no discount)", () => {
    expect(calculateBasketTotal({ 1: 2, 2: 0, 3: 0 }, 0)).toBe(30);
  });
  test("two distinct episodes = 10% discount (27)", () => {
    expect(
      calculateBasketTotal(
        {
          1: 1,
          2: 1,
          3: 0,
        },
        0,
      ),
    ).toBe(27);
  });

  test("thres distinct episodes = 20% discount (36)", () => {
    expect(calculateBasketTotal({ 1: 1, 2: 1, 3: 1 }, 0)).toBe(36);
  });

  test("multipe copies of distinct episodes", () => {
    // 5 total, 3 distinct -> 5*15*0.8=60
    expect(calculateBasketTotal({ "1": 2, "2": 2, 3: 1 }, 0)).toBe(60);
  });

  test("other movies at standard price", () => {
    expect(calculateBasketTotal(emptyBasket, 2)).toBe(40);
  });
  test("fill trilogy + 2 other movies = 76", () => {
    expect(calculateBasketTotal({ 1: 1, 2: 1, 3: 1 }, 2)).toBe(76);
  });
});
