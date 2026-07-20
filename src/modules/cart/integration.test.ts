import { describe, test, expect } from "bun:test";
import { parseCartInput, calculateCartTotal } from ".";

describe("end-to-end: parseCartInput → calculateCartTotal", () => {
  const cases: [string, number][] = [
    [
      `Back to the Future
Back to the Future 2
Back to the Future 3`,
      36,
    ],
    [
      `Back to the Future 1
Back to the Future 3`,
      27,
    ],
    [`Back to the Future I`, 15],
    [
      `Back to the Future 1
Back to the Future 2
Back to the Future Ii
Back to the Future IiI`,
      48,
    ],
    [
      `Back to the Future 1
Back to the Future 2
Back to the Future 3
La chèvre`,
      56,
    ],
  ];

  test.each(cases)("input → %i", (input, expected) => {
    const { bttf, otherMovies } = parseCartInput(input);
    expect(calculateCartTotal(bttf, otherMovies)).toBe(expected);
  });
});
