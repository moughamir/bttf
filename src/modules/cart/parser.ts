import { BTTF_PATTERN } from "./constants";
import type { BttfEpisode, ParseResult } from "./types";

const ROMAN_TO_NUM: Record<string, BttfEpisode> = {
  i: 1,
  ii: 2,
  iii: 3,
};

export function parseCartInput(input: string): ParseResult {
  const bttf = {
    1: 0,
    2: 0,
    3: 0,
  } as Record<BttfEpisode, number>;
  let otherMovies = 0;

  if (!input.trim()) return { bttf, otherMovies };

  const lines = input
    .split(/\r?\n/)
    .map((l): string => l.trim())
    .filter(Boolean);

  for (const line of lines) {
    const match = line.match(BTTF_PATTERN);
    if (match) {
      const episode: BttfEpisode = match[1]
        ? Number(match[1]) as BttfEpisode
        : match[2]
          ? (ROMAN_TO_NUM[match[2].toLowerCase()] as BttfEpisode)
          : 1;
      bttf[episode]++;
    } else {
      otherMovies++;
    }
  }

  return {
    bttf,
    otherMovies,
  };
}
