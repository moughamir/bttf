import { parseCartInput } from "./parser";
import { calculateCartTotal } from "./pricing";
import type { Example } from "./types";

function makeExample(label: string, value: string): Example {
  const { bttf, otherMovies } = parseCartInput(value);
  const price = calculateCartTotal(bttf, otherMovies);
  return { label: `${label} (${price} €)`, value };
}

export const EXAMPLES: Example[] = [
  { label: "Choisir un exemple…", value: "" },
  makeExample(
    "Ex. 1 — 3 volets",
    `Back to the Future 1\nBack to the Future 2\nBack to the Future 3`,
  ),
  makeExample("Ex. 2 — 2 volets", `Back to the Future 1\nBack to the Future 3`),
  makeExample("Ex. 3 — 1 volet", `Back to the Future 1`),
  makeExample(
    "Ex. 4 — 4 DVDs, 3 volets",
    `Back to the Future 1\nBack to the Future 2\nBack to the Future 3\nBack to the Future 2`,
  ),
  makeExample(
    "Ex. 5 — 3 volets + film étranger",
    `Back to the Future 1\nBack to the Future 2\nBack to the Future 3\nLa chèvre`,
  ),
];
