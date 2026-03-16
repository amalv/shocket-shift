import { createInitialState, getMessageForEvent, resetGame, stepGame } from "./game/engine";
import type { Direction, GameEvent, GameState, Level, StepResult } from "./game/types";

export type AppModel = {
  history: GameState[];
  lastStep: StepResult;
  soundEnabled: boolean;
  state: GameState;
  statusMessage: string;
};

export function createInitialModel(level: Level): AppModel {
  const state = createInitialState(level);

  return {
    history: [],
    lastStep: createStepResult("reset", state),
    soundEnabled: true,
    state,
    statusMessage: getMessageForEvent("reset", level),
  };
}

export function applyDirectionToModel(
  level: Level,
  currentModel: AppModel,
  direction: Direction,
): AppModel {
  const step = stepGame(level, currentModel.state, direction);

  return applyStep(level, currentModel, step);
}

export function resetModel(level: Level, currentModel: AppModel): AppModel {
  const nextState = resetGame(level);

  return {
    ...currentModel,
    history: [],
    lastStep: createStepResult("reset", nextState),
    state: nextState,
    statusMessage: getMessageForEvent("reset", level),
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

export function undoModel(level: Level, currentModel: AppModel): AppModel {
  const previousState = currentModel.history.at(-1);

  if (!previousState) {
    return currentModel;
  }

  const restoredState = cloneGameState(previousState);

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

function applyStep(level: Level, currentModel: AppModel, step: StepResult): AppModel {
  return {
    ...currentModel,
    history: shouldRecordHistory(step)
      ? [...currentModel.history, cloneGameState(currentModel.state)]
      : currentModel.history,
    lastStep: step,
    state: step.state,
    statusMessage: getMessageForEvent(step.event, level),
  };
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
