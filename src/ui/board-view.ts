import type { GameState, Level, MovementDelta, StepResult, Tile } from "../game/types";

export type BoardTileSnapshot = {
  hasCell: boolean;
  hasPlayer: boolean;
  isCharged: boolean;
  tile: Tile;
};

export type ChargeOrigin = "down" | "left" | "right" | "up";

export type GoalActivationEffect = {
  origin: ChargeOrigin | null;
  point: { x: number; y: number };
};

export type PlayerCelebrationEffect = {
  point: { x: number; y: number };
};

type TileRef = {
  aura: HTMLSpanElement;
  particles: HTMLSpanElement;
  piece: HTMLSpanElement;
  tile: HTMLDivElement;
  trail: HTMLSpanElement;
};

type BoardView = {
  render: (state: GameState, step: StepResult) => void;
};

type PieceKind = "cell" | "empty" | "player";

const surgeParticleSpecs = [
  { angle: "-90deg", delay: "0ms", distance: "18px" },
  { angle: "-28deg", delay: "24ms", distance: "16px" },
  { angle: "22deg", delay: "52ms", distance: "14px" },
  { angle: "70deg", delay: "86ms", distance: "17px" },
  { angle: "150deg", delay: "110ms", distance: "13px" },
] as const;

export const createBoardView = (board: HTMLDivElement, level: Level): BoardView => {
  const tileRefs = createTileRefs(board, level);
  let previousState: GameState | null = null;

  const render = (state: GameState, step: StepResult): void => {
    const snapshot = buildBoardSnapshot(level, state);

    applySnapshot(tileRefs, snapshot);
    animateStep(tileRefs, state, step, previousState !== null);
    board.classList.toggle("is-winning", state.won);
    previousState = state;
  };

  return { render };
};

export const buildBoardSnapshot = (level: Level, state: GameState): BoardTileSnapshot[][] => {
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
};

export const createGoalActivationEffects = (step: StepResult): GoalActivationEffect[] => {
  return step.activatedGoals.map((point) => ({
    origin: matchesPoint(step.pushedCellDelta?.to, point)
      ? getChargeOrigin(step.pushedCellDelta)
      : null,
    point,
  }));
};

export const createPlayerCelebrationEffects = (step: StepResult): PlayerCelebrationEffect[] => {
  if (step.activatedGoals.length === 0) {
    return [];
  }

  return [{ point: step.playerDelta?.to ?? step.state.player }];
};

export const getChargeOrigin = (delta: MovementDelta | null): ChargeOrigin | null => {
  if (!delta) {
    return null;
  }

  if (delta.to.x > delta.from.x) {
    return "left";
  }

  if (delta.to.x < delta.from.x) {
    return "right";
  }

  if (delta.to.y > delta.from.y) {
    return "up";
  }

  if (delta.to.y < delta.from.y) {
    return "down";
  }

  return null;
};

const createTileRefs = (board: HTMLDivElement, level: Level): TileRef[][] => {
  return level.grid.map((row, y) =>
    row.map((tile, x) => {
      const tileElement = document.createElement("div");
      const auraElement = document.createElement("span");
      const trailElement = document.createElement("span");
      const particlesElement = document.createElement("span");
      const pieceElement = document.createElement("span");

      tileElement.className = `tile ${tile}`;
      tileElement.dataset.x = String(x);
      tileElement.dataset.y = String(y);
      auraElement.className = "tile-aura";
      trailElement.className = "tile-trail";
      particlesElement.className = "tile-particles";
      pieceElement.className = "piece piece-empty";
      pieceElement.dataset.kind = "empty";

      tileElement.append(auraElement, trailElement, particlesElement, pieceElement);
      board.append(tileElement);

      return {
        aura: auraElement,
        particles: particlesElement,
        piece: pieceElement,
        tile: tileElement,
        trail: trailElement,
      };
    }),
  );
};

const applySnapshot = (tileRefs: TileRef[][], snapshot: BoardTileSnapshot[][]): void => {
  snapshot.forEach((row, y) => {
    row.forEach((tileState, x) => {
      const tileRef = tileRefs[y]?.[x];

      if (!tileRef) {
        return;
      }

      tileRef.tile.classList.remove("cell", "charged", "player");
      syncPieceKind(tileRef.piece, "empty");

      if (tileState.hasCell) {
        tileRef.tile.classList.add("cell");
        syncPieceKind(tileRef.piece, "cell");
      }

      if (tileState.isCharged) {
        tileRef.tile.classList.add("charged");
      }

      if (tileState.hasPlayer) {
        tileRef.tile.classList.add("player");
        syncPieceKind(tileRef.piece, "player");
      }
    });
  });
};

const animateStep = (
  tileRefs: TileRef[][],
  nextState: GameState,
  step: StepResult,
  shouldAnimate: boolean,
): void => {
  if (!shouldAnimate) {
    return;
  }

  if (step.playerDelta) {
    const playerTile = tileRefs[step.playerDelta.to.y]?.[step.playerDelta.to.x]?.tile;

    if (playerTile) {
      pulseClass(playerTile, "is-player-step", 180);
    }
  }

  if (step.pushedCellDelta) {
    const cellTile = tileRefs[step.pushedCellDelta.to.y]?.[step.pushedCellDelta.to.x]?.tile;

    if (cellTile) {
      pulseClass(cellTile, "is-cell-step", 210);
    }
  }

  if (step.event === "blocked") {
    const playerTile = tileRefs[nextState.player.y]?.[nextState.player.x]?.tile;

    if (playerTile) {
      pulseClass(playerTile, "is-blocked", 180);
    }
  }

  for (const effect of createGoalActivationEffects(step)) {
    const tileRef = tileRefs[effect.point.y]?.[effect.point.x];

    if (!tileRef) {
      continue;
    }

    pulseClass(tileRef.tile, "is-surging", 460);
    pulseClass(tileRef.tile, "is-powering-on", 1120, () => {
      delete tileRef.tile.dataset.chargeOrigin;
    });

    if (effect.origin) {
      tileRef.tile.dataset.chargeOrigin = effect.origin;
    }

    burstParticles(tileRef.particles);
    pulseClass(tileRef.aura, "is-flaring", 940);
    pulseClass(tileRef.trail, "is-trailing", 680);
  }

  for (const effect of createPlayerCelebrationEffects(step)) {
    const playerTile = tileRefs[effect.point.y]?.[effect.point.x]?.tile;

    if (!playerTile) {
      continue;
    }

    queuePulseClass(playerTile, "is-celebrating", 920, 560);
  }
};

const syncPieceKind = (piece: HTMLSpanElement, kind: PieceKind): void => {
  if (piece.dataset.kind === kind) {
    return;
  }

  piece.dataset.kind = kind;
  piece.className = kind === "empty" ? "piece piece-empty" : `piece ${kind}-piece`;

  switch (kind) {
    case "cell":
      piece.replaceChildren(
        createCellMeter(),
        createPiecePart("cell-core"),
        createPiecePart("cell-cap"),
      );
      return;
    case "player":
      piece.replaceChildren(createPlayerFace(), createPiecePart("player-thruster"));
      return;
    default:
      piece.replaceChildren();
  }
};

const createCellMeter = (): HTMLSpanElement => {
  const meter = document.createElement("span");

  meter.className = "cell-meter";
  meter.replaceChildren(
    ...Array.from({ length: 3 }, () => {
      const bar = document.createElement("span");

      bar.className = "cell-meter-bar";
      return bar;
    }),
  );

  return meter;
};

const createPlayerFace = (): HTMLSpanElement => {
  const face = document.createElement("span");

  face.className = "player-face";
  face.replaceChildren(createPiecePart("player-eye"), createPiecePart("player-eye"));
  return face;
};

const createPiecePart = (className: string): HTMLSpanElement => {
  const element = document.createElement("span");

  element.className = className;
  return element;
};

const burstParticles = (container: HTMLSpanElement): void => {
  container.replaceChildren(
    ...surgeParticleSpecs.map((spec) => {
      const particle = document.createElement("span");

      particle.className = "surge-particle";
      particle.style.setProperty("--particle-angle", spec.angle);
      particle.style.setProperty("--particle-delay", spec.delay);
      particle.style.setProperty("--particle-distance", spec.distance);
      return particle;
    }),
  );

  pulseClass(container, "is-active", 760, () => {
    container.replaceChildren();
  });
};

const matchesPoint = (
  first: { x: number; y: number } | null | undefined,
  second: { x: number; y: number },
): boolean => {
  return first?.x === second.x && first.y === second.y;
};

const pulseClass = (
  element: HTMLElement,
  className: string,
  duration: number,
  onComplete?: () => void,
): void => {
  element.classList.remove(className);
  void element.offsetWidth;
  element.classList.add(className);

  window.setTimeout(() => {
    element.classList.remove(className);
    onComplete?.();
  }, duration);
};

const queuePulseClass = (
  element: HTMLElement,
  className: string,
  duration: number,
  delay: number,
): void => {
  window.setTimeout(() => {
    pulseClass(element, className, duration);
  }, delay);
};
