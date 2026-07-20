import { describe, test, expect } from "bun:test";
import { parseCartInput } from "./parser";

describe("parseCartInput", () => {
  describe("empty input", () => {
    test("returns zero for otherMovies when input is empty", () => {
      expect(parseCartInput("").otherMovies).toBe(0);
    });

    test("returns zero for all Back to the Future parts when input is empty", () => {
      expect(parseCartInput("").bttf).toEqual({ 1: 0, 2: 0, 3: 0 });
    });
  });

  describe("single Back to the Future movie", () => {
    test("parses 'Back To The Future 1' and counts part 1", () => {
      expect(parseCartInput("Back To The Future 1").bttf).toEqual({
        1: 1,
        2: 0,
        3: 0,
      });
    });

    test("parses 'Back to the Future 2' and counts part 2", () => {
      expect(parseCartInput("Back to the Future 2").bttf).toEqual({
        1: 0,
        2: 1,
        3: 0,
      });
    });

    test("parses 'Back to the Future 3' and counts part 3", () => {
      expect(parseCartInput("Back to the Future 3").bttf).toEqual({
        1: 0,
        2: 0,
        3: 1,
      });
    });
  });

  describe("other movies", () => {
    test("counts non-BTTF movies in otherMovies", () => {
      expect(parseCartInput("La chèvre").otherMovies).toBe(1);
    });

    test("does not match partial BTTF titles or invalid parts", () => {
      const result = parseCartInput("Back to the Future 12");
      expect(result.bttf).toEqual({ 1: 0, 2: 0, 3: 0 });
      expect(result.otherMovies).toBe(1);
    });

    test("does not match mixed titles", () => {
      const result = parseCartInput("Back to the Future 1 and 2");
      expect(result.bttf).toEqual({ 1: 0, 2: 0, 3: 0 });
      expect(result.otherMovies).toBe(1);
    });
  });

  describe("edge cases - title variants", () => {
    test("matches 'Back To The Future' without episode number as episode 1", () => {
      const result = parseCartInput("Back To The Future");
      expect(result.bttf).toEqual({ 1: 1, 2: 0, 3: 0 });
      expect(result.otherMovies).toBe(0);
    });

    test("matches 'back to the future' lowercase without episode number", () => {
      const result = parseCartInput("back to the future");
      expect(result.bttf).toEqual({ 1: 1, 2: 0, 3: 0 });
    });

    test("matches Roman numeral 'I' as episode 1", () => {
      const result = parseCartInput("Back To The Future I");
      expect(result.bttf).toEqual({ 1: 1, 2: 0, 3: 0 });
      expect(result.otherMovies).toBe(0);
    });

    test("matches Roman numeral 'II' as episode 2", () => {
      const result = parseCartInput("Back To The Future II");
      expect(result.bttf).toEqual({ 1: 0, 2: 1, 3: 0 });
      expect(result.otherMovies).toBe(0);
    });

    test("matches Roman numeral 'III' as episode 3", () => {
      const result = parseCartInput("Back To The Future III");
      expect(result.bttf).toEqual({ 1: 0, 2: 0, 3: 1 });
      expect(result.otherMovies).toBe(0);
    });

    test("matches lowercase roman numerals", () => {
      const result = parseCartInput("back to the future ii");
      expect(result.bttf).toEqual({ 1: 0, 2: 1, 3: 0 });
    });
  });

  describe("multi-line input", () => {
    test("parses newline-separated items and counts each movie", () => {
      const input = `
        Back to the Future 1
        Back to the Future 2
        La chèvre`;
      const result = parseCartInput(input);
      expect(result.bttf).toEqual({ 1: 1, 2: 1, 3: 0 });
      expect(result.otherMovies).toBe(1);
    });

    test("counts duplicate BTTF entries separately", () => {
      const input = `
        Back to the Future 1
        Back to the Future 2
        Back to the Future 3
        Back to the Future 2`;
      expect(parseCartInput(input).bttf).toEqual({ 1: 1, 2: 2, 3: 1 });
    });

    test("is case-insensitive for movie titles", () => {
      const input = `
        back to the future 1
        BACK TO THE FUTURE 2`;
      const result = parseCartInput(input);
      expect(result.bttf).toEqual({ 1: 1, 2: 1, 3: 0 });
    });

    test("ignores blank lines between entries", () => {
      const input = `
        Back to the Future 1

        Back to the Future 3`;
      expect(parseCartInput(input).bttf).toEqual({ 1: 1, 2: 0, 3: 1 });
    });
  });
});
