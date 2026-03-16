import { createBoardSurfaceMarkup } from "../components/board-surface";
import { createControlButtonMarkup } from "../components/button";
import { createStatCardMarkup } from "../components/stat-card";
import { createStatusBannerMarkup } from "../components/status-banner";
import { escapeHtml } from "../shared/escape-html";

export type GameShellMarkupOptions = {
  boardAriaLabel?: string;
  boardColumns: number;
  levelName: string;
  moves: string;
  socketCount: string;
  soundEnabled: boolean;
  statusMessage: string;
  won?: boolean;
};

export const createGameShellMarkup = ({
  boardAriaLabel = "Puzzle grid with walls, sockets, power cells, and the player",
  boardColumns,
  levelName,
  moves,
  socketCount,
  soundEnabled,
  statusMessage,
  won = false,
}: GameShellMarkupOptions): string => {
  return `
    <main class="shell">
      <section class="panel intro">
        <p class="eyebrow">${escapeHtml(levelName)}</p>
        <h1>Socket Shift</h1>
        <p class="lede">
          Guide the maintenance drone and push every power cell into a live socket.
        </p>
        <div class="stats">
          ${createStatCardMarkup({ label: "Moves", value: moves, valueAttributes: "data-moves" })}
          ${createStatCardMarkup({ label: "Sockets", value: socketCount })}
        </div>
        <div class="actions">
          ${createControlButtonMarkup({ label: "Reset level", dataAttribute: "data-reset" })}
          ${createControlButtonMarkup({
            ariaPressed: soundEnabled,
            label: soundEnabled ? "Sound on" : "Sound off",
            tone: "ghost",
            dataAttribute: "data-sound",
          })}
        </div>
        <p class="hint">Move with arrow keys or WASD. Reset with R.</p>
      </section>
      <section class="panel board-panel">
        ${createBoardSurfaceMarkup({
          ariaLabel: boardAriaLabel,
          columns: boardColumns,
          dataAttribute: "data-board",
        })}
        ${createStatusBannerMarkup({
          dataAttribute: "data-status",
          message: statusMessage,
          tone: won ? "won" : "default",
        })}
      </section>
    </main>
  `;
};
