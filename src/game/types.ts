export type Tile = "wall" | "floor" | "goal";
export type Direction = "up" | "down" | "left" | "right";

export type Point = {
  x: number;
  y: number;
};

export type MovementDelta = {
  from: Point;
  to: Point;
};

export type GameState = {
  player: Point;
  cells: Point[];
  moves: number;
  won: boolean;
};

export type Level = {
  id: string;
  name: string;
  width: number;
  height: number;
  grid: Tile[][];
  goals: Point[];
  startingPlayer: Point;
  startingCells: Point[];
};

export type GameEvent = "blocked" | "move" | "push" | "reset" | "undo" | "win";

export type StepResult = {
  activatedGoals: Point[];
  event: GameEvent;
  playerDelta: MovementDelta | null;
  state: GameState;
  pushedCellDelta: MovementDelta | null;
};
