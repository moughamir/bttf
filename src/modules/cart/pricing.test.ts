import { describe, test, expect } from "bun:test";
import type { BttfCart } from "./types";
import { calculateCartTotal } from "./pricing";

const emptyCart: BttfCart = { 1: 0, 2: 0, 3: 0 };

describe("calculateCartTotal", () => {
  test("Empty Cart = 0", () => {
    expect(calculateCartTotal(emptyCart, 0)).toBe(0);
  });
  test("single BTTF episode = 15", () => {
    expect(
      calculateCartTotal(
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
    expect(calculateCartTotal({ 1: 2, 2: 0, 3: 0 }, 0)).toBe(30);
  });
  test("two distinct episodes = 10% discount (27)", () => {
    expect(
      calculateCartTotal(
        {
          1: 1,
          2: 1,
          3: 0,
        },
        0,
      ),
    ).toBe(27);
  });

  test("three distinct episodes = 20% discount (36)", () => {
    expect(calculateCartTotal({ 1: 1, 2: 1, 3: 1 }, 0)).toBe(36);
  });

  test("multiple copies of distinct episodes", () => {
    // 5 total, 3 distinct -> 5*15*0.8=60
    expect(calculateCartTotal({ "1": 2, "2": 2, 3: 1 }, 0)).toBe(60);
  });

  test("other movies at standard price", () => {
    expect(calculateCartTotal(emptyCart, 2)).toBe(40);
  });
  test("full trilogy + 2 other movies = 76", () => {
    expect(calculateCartTotal({ 1: 1, 2: 1, 3: 1 }, 2)).toBe(76);
  });
});
