import type { Direction, GameEvent, GameState, Level, Point, StepResult } from "./types";

const directionVectors: Record<Direction, Point> = {
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
  up: { x: 0, y: -1 },
};

export function createInitialState(level: Level): GameState {
  return {
    cells: clonePoints(level.startingCells),
    moves: 0,
    player: { ...level.startingPlayer },
    won: false,
  };
}

export function resetGame(level: Level): GameState {
  return createInitialState(level);
}

export function getDirectionFromKey(key: string): Direction | null {
  switch (key.toLowerCase()) {
    case "arrowup":
    case "w":
      return "up";
    case "arrowdown":
    case "s":
      return "down";
    case "arrowleft":
    case "a":
      return "left";
    case "arrowright":
    case "d":
      return "right";
    default:
      return null;
  }
}

export function stepGame(level: Level, state: GameState, direction: Direction): StepResult {
  if (state.won) {
    return {
      activatedGoals: [],
      event: "win",
      playerDelta: null,
      state,
      pushedCellDelta: null,
    };
  }

  const vector = directionVectors[direction];
  const nextPlayer = translatePoint(state.player, vector);

  if (isWall(level, nextPlayer)) {
    return {
      activatedGoals: [],
      event: "blocked",
      playerDelta: null,
      state,
      pushedCellDelta: null,
    };
  }

  const blockingCellIndex = findCellIndex(state.cells, nextPlayer);

  if (blockingCellIndex === -1) {
    const movedState = {
      ...state,
      moves: state.moves + 1,
      player: nextPlayer,
    };

    return {
      activatedGoals: [],
      event: "move",
      playerDelta: {
        from: { ...state.player },
        to: nextPlayer,
      },
      state: movedState,
      pushedCellDelta: null,
    };
  }

  const pushedCellFrom = { ...state.cells[blockingCellIndex] };
  const pushedCell = translatePoint(pushedCellFrom, vector);

  if (isWall(level, pushedCell) || findCellIndex(state.cells, pushedCell) !== -1) {
    return {
      activatedGoals: [],
      event: "blocked",
      playerDelta: null,
      state,
      pushedCellDelta: null,
    };
  }

  const nextCells = state.cells.map((cell, index) =>
    index === blockingCellIndex ? pushedCell : { ...cell },
  );
  const activatedGoals = getActivatedGoals(level, state.cells, nextCells);
  const won = areAllGoalsFilled(level, nextCells);
  const nextState = {
    cells: nextCells,
    moves: state.moves + 1,
    player: nextPlayer,
    won,
  };

  return {
    activatedGoals,
    event: won ? "win" : "push",
    playerDelta: {
      from: { ...state.player },
      to: nextPlayer,
    },
    state: nextState,
    pushedCellDelta: {
      from: pushedCellFrom,
      to: pushedCell,
    },
  };
}

export function getMessageForEvent(eventName: GameEvent, level: Level): string {
  switch (eventName) {
    case "blocked":
      return "That route is jammed. Try another angle.";
    case "move":
      return `Keep the ${level.goals.length} sockets in sight.`;
    case "push":
      return "Cell shifted. The grid is stabilizing.";
    case "reset":
      return "Level reset. Systems ready.";
    case "undo":
      return "Move rewound. Re-route the grid.";
    case "win":
      return "Grid stable. All sockets are powered.";
    default:
      return "Systems ready.";
  }
}

function isWall(level: Level, point: Point): boolean {
  return level.grid[point.y]?.[point.x] === "wall";
}

function areAllGoalsFilled(level: Level, cells: Point[]): boolean {
  return level.goals.every((goal) => findCellIndex(cells, goal) !== -1);
}

function getActivatedGoals(level: Level, previousCells: Point[], nextCells: Point[]): Point[] {
  return level.goals.filter((goal) => {
    const wasFilled = findCellIndex(previousCells, goal) !== -1;
    const isFilled = findCellIndex(nextCells, goal) !== -1;

    return !wasFilled && isFilled;
  });
}

function findCellIndex(cells: Point[], point: Point): number {
  return cells.findIndex((cell) => cell.x === point.x && cell.y === point.y);
}

function translatePoint(point: Point, vector: Point): Point {
  return {
    x: point.x + vector.x,
    y: point.y + vector.y,
  };
}

function clonePoints(points: Point[]): Point[] {
  return points.map((point) => ({ ...point }));
}
