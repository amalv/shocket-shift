import "./styles.css";

import {
  type AppModel,
  applyDirectionToModel,
  canUndo,
  createInitialModel,
  resetModel,
  toggleSoundInModel,
  undoModel,
} from "./app-model";
import { createSoundPlayer } from "./audio/sound-player";
import { getDirectionFromKey } from "./game/engine";
import { prototypeLevel } from "./game/levels";
import { createAppRenderer } from "./ui/create-app-renderer";

const appRoot = document.querySelector<HTMLDivElement>("#app");

if (!appRoot) {
  throw new Error("App root not found");
}

const level = prototypeLevel;
const soundPlayer = createSoundPlayer();
let model: AppModel = createInitialModel(level);
const renderer = createAppRenderer({
  level,
  root: appRoot,
  onUndo: handleUndo,
  onReset: handleReset,
  onToggleSound: handleToggleSound,
});

renderApp(model);
window.addEventListener("keydown", handleKeydown);

function handleKeydown(event: KeyboardEvent): void {
  const direction = getDirectionFromKey(event.key);

  if (direction) {
    event.preventDefault();
    model = applyDirectionToModel(level, model, direction);
    playSound(model);
    renderApp(model);
    return;
  }

  switch (event.key.toLowerCase()) {
    case "r":
      event.preventDefault();
      handleReset();
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

function handleReset(): void {
  model = resetModel(level, model);
  playSound(model);
  renderApp(model);
}

function handleUndo(): void {
  model = undoModel(level, model);
  playSound(model);
  renderApp(model);
}

function handleToggleSound(): void {
  model = toggleSoundInModel(model);
  renderApp(model);
}

function playSound(nextModel: AppModel): void {
  if (!nextModel.soundEnabled) {
    return;
  }

  soundPlayer.play(nextModel.lastStep);
}

function renderApp(nextModel: AppModel): void {
  renderer.render({
    canUndo: canUndo(nextModel),
    lastStep: nextModel.lastStep,
    soundEnabled: nextModel.soundEnabled,
    state: nextModel.state,
    statusMessage: nextModel.statusMessage,
  });
}
