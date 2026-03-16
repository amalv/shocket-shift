import { createGameShellMarkup } from "../design-system/layouts/game-shell";
import type { GameState, Level, StepResult } from "../game/types";
import { createBoardView } from "./board-view";

type RendererOptions = {
  level: Level;
  onReset: () => void;
  onToggleSound: () => void;
  root: HTMLDivElement;
};

type RenderModel = {
  lastStep: StepResult;
  soundEnabled: boolean;
  state: GameState;
  statusMessage: string;
};

type AppRenderer = {
  render: (model: RenderModel) => void;
};

export function createAppRenderer(options: RendererOptions): AppRenderer {
  options.root.innerHTML = createGameShellMarkup({
    boardColumns: options.level.width,
    levelName: options.level.name,
    moves: "0",
    socketCount: String(options.level.goals.length),
    soundEnabled: true,
    statusMessage: "",
  });

  const board = options.root.querySelector<HTMLDivElement>("[data-board]");
  const moves = options.root.querySelector<HTMLElement>("[data-moves]");
  const status = options.root.querySelector<HTMLDivElement>("[data-status]");
  const resetButton = options.root.querySelector<HTMLButtonElement>("[data-reset]");
  const soundButton = options.root.querySelector<HTMLButtonElement>("[data-sound]");

  if (!board || !moves || !status || !resetButton || !soundButton) {
    throw new Error("Renderer setup failed");
  }

  const boardView = createBoardView(board, options.level);

  resetButton.addEventListener("click", options.onReset);
  soundButton.addEventListener("click", options.onToggleSound);

  return {
    render(model) {
      moves.textContent = String(model.state.moves);
      status.textContent = model.statusMessage;
      status.classList.toggle("won", model.state.won);
      status.classList.toggle("status-banner--won", model.state.won);
      soundButton.textContent = model.soundEnabled ? "Sound on" : "Sound off";
      soundButton.setAttribute("aria-pressed", String(model.soundEnabled));
      boardView.render(model.state, model.lastStep);
    },
  };
}
