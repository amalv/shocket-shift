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
  options.root.innerHTML = createShellMarkup(options.level);

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
      soundButton.textContent = model.soundEnabled ? "Sound on" : "Sound off";
      soundButton.setAttribute("aria-pressed", String(model.soundEnabled));
      boardView.render(model.state, model.lastStep);
    },
  };
}

function createShellMarkup(level: Level): string {
  return `
    <main class="shell">
      <section class="panel intro">
        <p class="eyebrow">${level.name}</p>
        <h1>Socket Shift</h1>
        <p class="lede">
          Guide the maintenance drone and push every power cell into a live socket.
        </p>
        <div class="stats">
          <div>
            <span class="label">Moves</span>
            <strong data-moves>0</strong>
          </div>
          <div>
            <span class="label">Sockets</span>
            <strong>${level.goals.length}</strong>
          </div>
        </div>
        <div class="actions">
          <button type="button" data-reset>Reset level</button>
          <button type="button" class="ghost-button" data-sound>Sound on</button>
        </div>
        <p class="hint">Move with arrow keys or WASD. Reset with R.</p>
      </section>
      <section class="panel board-panel">
        <div
          class="board"
          data-board
          style="grid-template-columns: repeat(${level.width}, minmax(0, 1fr));"
          role="img"
          aria-label="Puzzle grid with walls, sockets, power cells, and the player"
        ></div>
        <div class="status" data-status></div>
      </section>
    </main>
  `;
}
