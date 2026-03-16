import type { GameState, Level, StepResult, Tile } from "../game/types";

export type BoardTileSnapshot = {
  hasCell: boolean;
  hasPlayer: boolean;
  isCharged: boolean;
  tile: Tile;
};

type TileRef = {
  piece: HTMLSpanElement;
  tile: HTMLDivElement;
};

type BoardView = {
  render: (state: GameState, step: StepResult) => void;
};

export function createBoardView(board: HTMLDivElement, level: Level): BoardView {
  const tileRefs = createTileRefs(board, level);
  let previousState: GameState | null = null;

  return {
    render(state, step) {
      const snapshot = buildBoardSnapshot(level, state);

      applySnapshot(tileRefs, snapshot);
      animateStep(tileRefs, state, step, previousState !== null);
      board.classList.toggle("is-winning", state.won);
      previousState = state;
    },
  };
}

export function buildBoardSnapshot(level: Level, state: GameState): BoardTileSnapshot[][] {
  return level.grid.map((row, y) =>
    row.map((tile, x) => {
      const hasCell = state.cells.some((cell) => cell.x === x && cell.y === y);
      const hasPlayer = state.player.x === x && state.player.y === y;

      return {
        hasCell,
        hasPlayer,
        isCharged: tile === "goal" && hasCell,
        tile,
      };
    }),
  );
}

function createTileRefs(board: HTMLDivElement, level: Level): TileRef[][] {
  return level.grid.map((row, y) =>
    row.map((tile, x) => {
      const tileElement = document.createElement("div");
      const pieceElement = document.createElement("span");

      tileElement.className = `tile ${tile}`;
      tileElement.dataset.x = String(x);
      tileElement.dataset.y = String(y);
      pieceElement.className = "piece piece-empty";

      tileElement.append(pieceElement);
      board.append(tileElement);

      return {
        piece: pieceElement,
        tile: tileElement,
      };
    }),
  );
}

function applySnapshot(tileRefs: TileRef[][], snapshot: BoardTileSnapshot[][]): void {
  snapshot.forEach((row, y) => {
    row.forEach((tileState, x) => {
      const tileRef = tileRefs[y]?.[x];

      if (!tileRef) {
        return;
      }

      tileRef.tile.classList.remove("cell", "charged", "player");
      tileRef.piece.className = "piece piece-empty";

      if (tileState.hasCell) {
        tileRef.tile.classList.add("cell");
        tileRef.piece.className = "piece cell-piece";
      }

      if (tileState.isCharged) {
        tileRef.tile.classList.add("charged");
      }

      if (tileState.hasPlayer) {
        tileRef.tile.classList.add("player");
        tileRef.piece.className = "piece player-piece";
      }
    });
  });
}

function animateStep(
  tileRefs: TileRef[][],
  nextState: GameState,
  step: StepResult,
  shouldAnimate: boolean,
): void {
  if (!shouldAnimate) {
    return;
  }

  if (step.playerDelta) {
    const playerTile = tileRefs[step.playerDelta.to.y]?.[step.playerDelta.to.x]?.tile;

    if (playerTile) {
      pulseClass(playerTile, "is-player-step");
    }
  }

  if (step.pushedCellDelta) {
    const cellTile = tileRefs[step.pushedCellDelta.to.y]?.[step.pushedCellDelta.to.x]?.tile;

    if (cellTile) {
      pulseClass(cellTile, "is-cell-step");
    }
  }

  if (step.event === "blocked") {
    const playerTile = tileRefs[nextState.player.y]?.[nextState.player.x]?.tile;

    if (playerTile) {
      pulseClass(playerTile, "is-blocked");
    }
  }

  for (const goal of step.activatedGoals) {
    const goalTile = tileRefs[goal.y]?.[goal.x]?.tile;

    if (goalTile) {
      pulseClass(goalTile, "is-surging");
    }
  }
}

function pulseClass(element: HTMLDivElement, className: string): void {
  element.classList.remove(className);
  void element.offsetWidth;
  element.classList.add(className);

  window.setTimeout(() => {
    element.classList.remove(className);
  }, 260);
}
