import { describe, expect, it } from "vitest";

import { parseLevel } from "./parse-level";

describe("parseLevel", () => {
  it("parses a valid level into structured data", () => {
    const options = {
      id: "test-level",
      name: "Test Level",
      rows: ["#####", "#PG.#", "#.C.#", "#####"],
    };

    const level = parseLevel(options);

    expect(level.width).toBe(5);
    expect(level.height).toBe(4);
    expect(level.startingPlayer).toEqual({ x: 1, y: 1 });
    expect(level.goals).toEqual([{ x: 2, y: 1 }]);
    expect(level.startingCells).toEqual([{ x: 2, y: 2 }]);
  });

  it("throws when row widths are uneven", () => {
    const createLevel = () =>
      parseLevel({
        id: "broken-level",
        name: "Broken",
        rows: ["#####", "#P.#", "#####"],
      });

    expect(createLevel).toThrow('Level "broken-level" has uneven row widths');
  });

  it("throws when the level is missing a player", () => {
    const createLevel = () =>
      parseLevel({
        id: "missing-player",
        name: "Missing Player",
        rows: ["#####", "#.G.#", "#.C.#", "#####"],
      });

    expect(createLevel).toThrow('Level "missing-player" is missing a player start');
  });
});
