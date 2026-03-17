import "./styles.css";

import {
  type AppModel,
  advanceToNextLevel,
  applyDirectionToModel,
  canAdvanceToNextLevel,
  canUndo,
  createInitialModel,
  getActiveLevel,
  isCampaignComplete,
  resetModel,
  restartCampaignModel,
  toggleSoundInModel,
  undoModel,
} from "./app-model";
import { createSoundPlayer } from "./audio/sound-player";
import { getDirectionFromKey } from "./game/engine";
import { campaignLevels } from "./game/levels";
import { createAppRenderer } from "./ui/create-app-renderer";

const appRoot = document.querySelector<HTMLDivElement>("#app");
const autoAdvanceDelayMs = 1400;

if (!appRoot) {
  throw new Error("App root not found");
}

const soundPlayer = createSoundPlayer();
let model: AppModel = createInitialModel(campaignLevels);
let pendingAdvanceTimeout: number | null = null;
const renderer = createAppRenderer({
  root: appRoot,
  onPrimaryAction: handlePrimaryAction,
  onUndo: handleUndo,
  onToggleSound: handleToggleSound,
});

renderApp(model);
window.addEventListener("keydown", handleKeydown);

function handleKeydown(event: KeyboardEvent): void {
  const direction = getDirectionFromKey(event.key);

  if (direction) {
    event.preventDefault();
    commitModel(applyDirectionToModel(model, direction));
    return;
  }

  switch (event.key.toLowerCase()) {
    case "r":
      event.preventDefault();
      handlePrimaryAction();
      return;
    case "n":
      event.preventDefault();
      handleNewGame();
      return;
    case "z":
      if (!canUndo(model)) {
        return;
      }

      event.preventDefault();
      handleUndo();
      return;
    default:
      return;
  }
}

function handlePrimaryAction(): void {
  commitModel(isCampaignComplete(model) ? restartCampaignModel(model) : resetModel(model));
}

function handleUndo(): void {
  commitModel(undoModel(model));
}

function handleNewGame(): void {
  commitModel(restartCampaignModel(model));
}

function handleToggleSound(): void {
  commitModel(toggleSoundInModel(model), false);
}

function playSound(nextModel: AppModel): void {
  if (!nextModel.soundEnabled) {
    return;
  }

  soundPlayer.play(nextModel.lastStep);
}

function renderApp(nextModel: AppModel): void {
  const activeLevel = getActiveLevel(nextModel);

  renderer.render({
    canUndo: canUndo(nextModel),
    lastStep: nextModel.lastStep,
    level: activeLevel,
    levelProgress: `${nextModel.activeLevelIndex + 1} / ${nextModel.levels.length}`,
    primaryActionLabel: isCampaignComplete(nextModel) ? "New Game" : "Reset",
    soundEnabled: nextModel.soundEnabled,
    state: nextModel.state,
    statusMessage: nextModel.statusMessage,
  });
}

function commitModel(nextModel: AppModel, shouldPlaySound = true): void {
  if (nextModel === model) {
    return;
  }

  clearPendingAdvance();
  model = nextModel;

  if (shouldPlaySound) {
    playSound(model);
  }

  renderApp(model);
  scheduleAutoAdvance();
}

function scheduleAutoAdvance(): void {
  if (!canAdvanceToNextLevel(model) || isCampaignComplete(model)) {
    return;
  }

  pendingAdvanceTimeout = window.setTimeout(() => {
    pendingAdvanceTimeout = null;
    commitModel(advanceToNextLevel(model));
  }, autoAdvanceDelayMs);
}

function clearPendingAdvance(): void {
  if (pendingAdvanceTimeout === null) {
    return;
  }

  window.clearTimeout(pendingAdvanceTimeout);
  pendingAdvanceTimeout = null;
}
