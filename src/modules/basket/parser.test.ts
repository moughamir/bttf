import { describe, test, expect } from "bun:test";
import { parseBasketInput } from "./parser";

describe("parseBasketInput", () => {
  describe("empty input", () => {
    test("returns zero for otherMovies when input is empty", () => {
      expect(parseBasketInput("").otherMovies).toBe(0);
    });

    test("returns zero for all Back to the Future parts when input is empty", () => {
      expect(parseBasketInput("").bttf).toEqual({ 1: 0, 2: 0, 3: 0 });
    });
  });

  describe("single Back to the Future movie", () => {
    test("parses 'Back To The Future 1' and counts part 1", () => {
      expect(parseBasketInput("Back To The Future 1").bttf).toEqual({
        1: 1,
        2: 0,
        3: 0,
      });
    });

    test("parses 'Back to the Future 2' and counts part 2", () => {
      expect(parseBasketInput("Back to the Future 2").bttf).toEqual({
        1: 0,
        2: 1,
        3: 0,
      });
    });

    test("parses 'Back to the Future 3' and counts part 3", () => {
      expect(parseBasketInput("Back to the Future 3").bttf).toEqual({
        1: 0,
        2: 0,
        3: 1,
      });
    });
  });

  describe("other movies", () => {
    test("counts non-BTTF movies in otherMovies", () => {
      expect(parseBasketInput("La chèvre").otherMovies).toBe(1);
    });
  });

  describe("multi-line input", () => {
    test("parses newline-separated items and counts each movie", () => {
      const input = `
        Back to the Future 1
        Back to the Future 2
        La chèvre`;
      const result = parseBasketInput(input);
      expect(result.bttf).toEqual({ 1: 1, 2: 1, 3: 0 });
      expect(result.otherMovies).toBe(1);
    });

    test("counts duplicate BTTF entries separately", () => {
      const input = `
        Back to the Future 1
        Back to the Future 2
        Back to the Future 3
        Back to the Future 2`;
      expect(parseBasketInput(input).bttf).toEqual({ 1: 1, 2: 2, 3: 1 });
    });

    test("is case-insensitive for movie titles", () => {
      const input = `
        back to the future 1
        BACK TO THE FUTURE 2`;
      const result = parseBasketInput(input);
      expect(result.bttf).toEqual({ 1: 1, 2: 1, 3: 0 });
    });

    test("ignores blank lines between entries", () => {
      const input = `
        Back to the Future 1

        Back to the Future 3`;
      expect(parseBasketInput(input).bttf).toEqual({ 1: 1, 2: 0, 3: 1 });
    });
  });
});
