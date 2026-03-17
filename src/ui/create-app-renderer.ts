import { createGameShellMarkup } from "../design-system/layouts/game-shell";
import type { GameState, Level, StepResult } from "../game/types";
import { createBoardView } from "./board-view";

type RendererOptions = {
  onPrimaryAction: () => void;
  onUndo: () => void;
  onToggleSound: () => void;
  root: HTMLDivElement;
};

type RenderModel = {
  canUndo: boolean;
  lastStep: StepResult;
  level: Level;
  levelProgress: string;
  primaryActionLabel: string;
  soundEnabled: boolean;
  state: GameState;
  statusMessage: string;
};

type AppRenderer = {
  render: (model: RenderModel) => void;
};

export function createAppRenderer(options: RendererOptions): AppRenderer {
  let activeLevelId: string | null = null;
  let boardView: ReturnType<typeof createBoardView> | null = null;
  let shellRefs: {
    levelProgress: HTMLElement;
    moves: HTMLElement;
    primaryActionButton: HTMLButtonElement;
    socketCount: HTMLElement;
    soundButton: HTMLButtonElement;
    status: HTMLDivElement;
    undoButton: HTMLButtonElement;
  } | null = null;

  const mountShell = (model: RenderModel): void => {
    options.root.innerHTML = createGameShellMarkup({
      boardColumns: model.level.width,
      canUndo: model.canUndo,
      levelName: model.level.name,
      levelProgress: model.levelProgress,
      moves: String(model.state.moves),
      primaryActionLabel: model.primaryActionLabel,
      socketCount: String(model.level.goals.length),
      soundEnabled: model.soundEnabled,
      statusMessage: model.statusMessage,
      won: model.state.won,
    });

    const board = options.root.querySelector<HTMLDivElement>("[data-board]");
    const levelProgress = options.root.querySelector<HTMLElement>("[data-level-progress]");
    const moves = options.root.querySelector<HTMLElement>("[data-moves]");
    const primaryActionButton =
      options.root.querySelector<HTMLButtonElement>("[data-primary-action]");
    const socketCount = options.root.querySelector<HTMLElement>("[data-socket-count]");
    const status = options.root.querySelector<HTMLDivElement>("[data-status]");
    const undoButton = options.root.querySelector<HTMLButtonElement>("[data-undo]");
    const soundButton = options.root.querySelector<HTMLButtonElement>("[data-sound]");

    if (
      !board ||
      !levelProgress ||
      !moves ||
      !primaryActionButton ||
      !socketCount ||
      !status ||
      !undoButton ||
      !soundButton
    ) {
      throw new Error("Renderer setup failed");
    }

    primaryActionButton.addEventListener("click", options.onPrimaryAction);
    undoButton.addEventListener("click", options.onUndo);
    soundButton.addEventListener("click", options.onToggleSound);

    boardView = createBoardView(board, model.level);
    activeLevelId = model.level.id;
    shellRefs = {
      levelProgress,
      moves,
      primaryActionButton,
      socketCount,
      soundButton,
      status,
      undoButton,
    };
  };

  return {
    render(model) {
      if (!shellRefs || !boardView || activeLevelId !== model.level.id) {
        mountShell(model);
      }

      if (!shellRefs || !boardView) {
        throw new Error("Renderer setup failed");
      }

      shellRefs.levelProgress.textContent = model.levelProgress;
      shellRefs.moves.textContent = String(model.state.moves);
      shellRefs.socketCount.textContent = String(model.level.goals.length);
      shellRefs.status.textContent = model.statusMessage;
      shellRefs.status.classList.toggle("won", model.state.won);
      shellRefs.status.classList.toggle("status-banner--won", model.state.won);
      shellRefs.primaryActionButton.textContent = model.primaryActionLabel;
      shellRefs.undoButton.disabled = !model.canUndo;
      shellRefs.soundButton.textContent = "SFX";
      shellRefs.soundButton.setAttribute("aria-pressed", String(model.soundEnabled));
      shellRefs.soundButton.setAttribute(
        "aria-label",
        model.soundEnabled ? "Sound on" : "Sound off",
      );
      shellRefs.soundButton.setAttribute("title", model.soundEnabled ? "Sound on" : "Sound off");
      boardView.render(model.state, model.lastStep);
    },
  };
}
