import { createInitialState, getMessageForEvent, resetGame, stepGame } from "./game/engine";
import type { Direction, GameEvent, GameState, Level, StepResult } from "./game/types";

export type AppModel = {
  activeLevelIndex: number;
  history: GameState[];
  lastStep: StepResult;
  levels: Level[];
  soundEnabled: boolean;
  state: GameState;
  statusMessage: string;
};

export function createInitialModel(levels: Level[]): AppModel {
  const level = levels[0];

  if (!level) {
    throw new Error("At least one level is required to start the game");
  }

  const state = createInitialState(level);

  return {
    activeLevelIndex: 0,
    history: [],
    lastStep: createStepResult("reset", state),
    levels,
    soundEnabled: true,
    state,
    statusMessage: getMessageForEvent("reset", level),
  };
}

export function applyDirectionToModel(currentModel: AppModel, direction: Direction): AppModel {
  if (currentModel.state.won) {
    return currentModel;
  }

  const level = getActiveLevel(currentModel);
  const step = stepGame(level, currentModel.state, direction);

  return applyStep(currentModel, step);
}

export function resetModel(currentModel: AppModel): AppModel {
  const level = getActiveLevel(currentModel);
  const nextState = resetGame(level);

  return {
    ...currentModel,
    history: [],
    lastStep: createStepResult("reset", nextState),
    state: nextState,
    statusMessage: getMessageForEvent("reset", level),
  };
}

export function restartCampaignModel(currentModel: AppModel): AppModel {
  const firstLevel = currentModel.levels[0];

  if (!firstLevel) {
    throw new Error("At least one level is required to restart the game");
  }

  const nextState = createInitialState(firstLevel);

  return {
    ...currentModel,
    activeLevelIndex: 0,
    history: [],
    lastStep: createStepResult("reset", nextState),
    state: nextState,
    statusMessage: "New run loaded. Systems ready.",
  };
}

export function advanceToNextLevel(currentModel: AppModel): AppModel {
  if (!canAdvanceToNextLevel(currentModel)) {
    return currentModel;
  }

  const activeLevelIndex = currentModel.activeLevelIndex + 1;
  const nextLevel = currentModel.levels[activeLevelIndex];

  if (!nextLevel) {
    return currentModel;
  }

  const nextState = createInitialState(nextLevel);

  return {
    ...currentModel,
    activeLevelIndex,
    history: [],
    lastStep: createStepResult("reset", nextState),
    state: nextState,
    statusMessage: `Sector ${activeLevelIndex + 1} online. Systems ready.`,
  };
}

export function toggleSoundInModel(currentModel: AppModel): AppModel {
  return {
    ...currentModel,
    soundEnabled: !currentModel.soundEnabled,
  };
}

export function canUndo(currentModel: AppModel): boolean {
  return currentModel.history.length > 0;
}

export function canAdvanceToNextLevel(currentModel: AppModel): boolean {
  return currentModel.state.won && currentModel.activeLevelIndex < currentModel.levels.length - 1;
}

export function isCampaignComplete(currentModel: AppModel): boolean {
  return currentModel.state.won && currentModel.activeLevelIndex === currentModel.levels.length - 1;
}

export function getActiveLevel(currentModel: AppModel): Level {
  const level = currentModel.levels[currentModel.activeLevelIndex];

  if (!level) {
    throw new Error(`Missing level at index ${currentModel.activeLevelIndex}`);
  }

  return level;
}

export function undoModel(currentModel: AppModel): AppModel {
  const previousState = currentModel.history.at(-1);

  if (!previousState) {
    return currentModel;
  }

  const restoredState = cloneGameState(previousState);
  const level = getActiveLevel(currentModel);

  return {
    ...currentModel,
    history: currentModel.history.slice(0, -1),
    lastStep: createStepResult("undo", restoredState),
    state: restoredState,
    statusMessage: getMessageForEvent("undo", level),
  };
}

export function createStepResult(event: GameEvent, state: GameState): StepResult {
  return {
    activatedGoals: [],
    event,
    playerDelta: null,
    pushedCellDelta: null,
    state,
  };
}

function applyStep(currentModel: AppModel, step: StepResult): AppModel {
  const level = getActiveLevel(currentModel);

  return {
    ...currentModel,
    history: shouldRecordHistory(step)
      ? [...currentModel.history, cloneGameState(currentModel.state)]
      : currentModel.history,
    lastStep: step,
    state: step.state,
    statusMessage: getStatusMessage(currentModel, step.event, level),
  };
}

function getStatusMessage(currentModel: AppModel, event: GameEvent, level: Level): string {
  if (event !== "win") {
    return getMessageForEvent(event, level);
  }

  return currentModel.activeLevelIndex === currentModel.levels.length - 1
    ? "Grid stable. Every sector is powered."
    : "Grid stable. Routing the next sector.";
}

function shouldRecordHistory(step: StepResult): boolean {
  return step.playerDelta !== null || step.pushedCellDelta !== null;
}

function cloneGameState(state: GameState): GameState {
  return {
    cells: state.cells.map((cell) => ({ ...cell })),
    moves: state.moves,
    player: { ...state.player },
    won: state.won,
  };
}
