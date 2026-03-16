import type { Level, Point, Tile } from "./types";

type LevelSymbol = "#" | "." | "C" | "G" | "P";

type ParseLevelOptions = {
  id: string;
  name: string;
  rows: string[];
};

export function parseLevel(options: ParseLevelOptions): Level {
  const width = options.rows[0]?.length ?? 0;
  const grid: Tile[][] = [];
  const goals: Point[] = [];
  const startingCells: Point[] = [];
  let startingPlayer: Point | null = null;

  options.rows.forEach((row, y) => {
    if (row.length !== width) {
      throw new Error(`Level "${options.id}" has uneven row widths`);
    }

    const parsedRow: Tile[] = [];

    row.split("").forEach((symbol, x) => {
      const tile = parseSymbol(symbol as LevelSymbol, x, y, options.id);
      parsedRow.push(tile);

      if (symbol === "G") {
        goals.push({ x, y });
      }

      if (symbol === "C") {
        startingCells.push({ x, y });
      }

      if (symbol === "P") {
        startingPlayer = { x, y };
      }
    });

    grid.push(parsedRow);
  });

  if (!startingPlayer) {
    throw new Error(`Level "${options.id}" is missing a player start`);
  }

  if (goals.length === 0) {
    throw new Error(`Level "${options.id}" must contain at least one goal`);
  }

  return {
    grid,
    goals,
    height: options.rows.length,
    id: options.id,
    name: options.name,
    startingCells,
    startingPlayer,
    width,
  };
}

function parseSymbol(symbol: LevelSymbol, x: number, y: number, levelId: string): Tile {
  switch (symbol) {
    case "#":
      return "wall";
    case ".":
    case "C":
    case "P":
      return "floor";
    case "G":
      return "goal";
    default:
      throw new Error(`Unexpected tile "${symbol}" at ${x},${y} in level "${levelId}"`);
  }
}
