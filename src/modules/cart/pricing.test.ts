import { describe, test, expect } from "bun:test";
import type { BttfCart } from "./types";
import { calculateCartTotal, getBttfDiscountInfo } from "./pricing";

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

describe("getBttfDiscountInfo", () => {
  test("empty cart returns zero quantities and no discount", () => {
    const info = getBttfDiscountInfo(emptyCart);
    expect(info.totalQuantity).toBe(0);
    expect(info.distinctEpisodes).toBe(0);
    expect(info.discountRate).toBe(1.0);
    expect(info.savings).toBe(0);
  });

  test("single episode has no discount", () => {
    const info = getBttfDiscountInfo({ 1: 1, 2: 0, 3: 0 });
    expect(info.distinctEpisodes).toBe(1);
    expect(info.discountRate).toBe(1.0);
    expect(info.savings).toBe(0);
  });

  test("two distinct episodes gives 10% discount", () => {
    const info = getBttfDiscountInfo({ 1: 1, 2: 1, 3: 0 });
    expect(info.distinctEpisodes).toBe(2);
    expect(info.discountRate).toBe(0.9);
    expect(info.baseCost).toBe(30);
    expect(info.savings).toBe(3);
  });

  test("three distinct episodes gives 20% discount", () => {
    const info = getBttfDiscountInfo({ 1: 1, 2: 1, 3: 1 });
    expect(info.distinctEpisodes).toBe(3);
    expect(info.discountRate).toBe(0.8);
    expect(info.baseCost).toBe(45);
    expect(info.savings).toBe(9);
  });

  test("duplicates count toward quantity but not distinct", () => {
    const info = getBttfDiscountInfo({ 1: 2, 2: 1, 3: 1 });
    expect(info.totalQuantity).toBe(4);
    expect(info.distinctEpisodes).toBe(3);
    expect(info.savings).toBe(12);
  });
});
