import { BTTF_PATTERN } from "./constants";
import type { BttfEpisode, BttfCart, ParseResult } from "./types";

const ROMAN_TO_NUM: Record<string, BttfEpisode> = {
  i: 1,
  ii: 2,
  iii: 3,
};

export function parseCartInput(input: string): ParseResult {
  const bttf: BttfCart = {
    1: 0,
    2: 0,
    3: 0,
  };
  let otherMovies = 0;

  if (!input.trim()) return { bttf, otherMovies };

  const lines = input
    .split(/\r?\n/)
    .map((l): string => l.trim())
    .filter(Boolean);

  for (const line of lines) {
    const match = line.match(BTTF_PATTERN);
    if (match) {
      let episode: BttfEpisode;
      if (match[1]) {
        episode = Number(match[1]) as BttfEpisode;
      } else if (match[2]) {
        episode = ROMAN_TO_NUM[match[2].toLowerCase()] as BttfEpisode;
      } else {
        episode = 1;
      }
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
