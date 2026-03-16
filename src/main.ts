import "./styles.css";

import { createSoundPlayer } from "./audio/sound-player";
import {
  createInitialState,
  getDirectionFromKey,
  getMessageForEvent,
  resetGame,
  stepGame,
} from "./game/engine";
import { prototypeLevel } from "./game/levels";
import type { GameEvent, GameState, StepResult } from "./game/types";
import { createAppRenderer } from "./ui/create-app-renderer";

const appRoot = document.querySelector<HTMLDivElement>("#app");

if (!appRoot) {
  throw new Error("App root not found");
}

type AppModel = {
  lastStep: StepResult;
  soundEnabled: boolean;
  state: GameState;
  statusMessage: string;
};

const level = prototypeLevel;
const soundPlayer = createSoundPlayer();
let model: AppModel = createInitialModel();
const renderer = createAppRenderer({
  level,
  root: appRoot,
  onReset: handleReset,
  onToggleSound: handleToggleSound,
});

renderApp(model);
window.addEventListener("keydown", handleKeydown);

function handleKeydown(event: KeyboardEvent): void {
  const direction = getDirectionFromKey(event.key);

  if (!direction) {
    if (event.key.toLowerCase() === "r") {
      handleReset();
    }

    return;
  }

  event.preventDefault();

  const result = stepGame(level, model.state, direction);
  playSound(result, model.soundEnabled);
  model = applyStep(model, result);
  renderApp(model);
}

function handleReset(): void {
  const nextState = resetGame(level);
  const resetStep = createStepResult("reset", nextState);

  playSound(resetStep, model.soundEnabled);
  model = applyStep(model, resetStep);
  renderApp(model);
}

function handleToggleSound(): void {
  model = {
    ...model,
    soundEnabled: !model.soundEnabled,
  };
  renderApp(model);
}

function createInitialModel(): AppModel {
  const state = createInitialState(level);

  return {
    lastStep: createStepResult("reset", state),
    soundEnabled: true,
    state,
    statusMessage: getMessageForEvent("reset", level),
  };
}

function applyStep(currentModel: AppModel, step: StepResult): AppModel {
  return {
    ...currentModel,
    lastStep: step,
    state: step.state,
    statusMessage: getMessageForEvent(step.event, level),
  };
}

function createStepResult(event: GameEvent, state: GameState): StepResult {
  return {
    activatedGoals: [],
    event,
    playerDelta: null,
    pushedCellDelta: null,
    state,
  };
}

function playSound(step: StepResult, soundEnabled: boolean): void {
  if (!soundEnabled) {
    return;
  }

  soundPlayer.play(step);
}

function renderApp(nextModel: AppModel): void {
  renderer.render({
    lastStep: nextModel.lastStep,
    soundEnabled: nextModel.soundEnabled,
    state: nextModel.state,
    statusMessage: nextModel.statusMessage,
  });
}
