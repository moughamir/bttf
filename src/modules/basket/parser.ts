import { BTTF_PATTERN } from "@/shared/constants";
import type { BttfEpisode, ParseResult } from "@/shared/types";

export function parseBasketInput(input: string): ParseResult {
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
      const episode = Number(match[1]) as BttfEpisode;
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
