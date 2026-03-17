import { createBoardSurfaceMarkup } from "../components/board-surface";
import { createControlButtonMarkup } from "../components/button";
import { createStatCardMarkup } from "../components/stat-card";
import { createStatusBannerMarkup } from "../components/status-banner";
import { escapeHtml } from "../shared/escape-html";

export type GameShellMarkupOptions = {
  boardAriaLabel?: string;
  boardColumns: number;
  canUndo: boolean;
  levelName: string;
  levelProgress: string;
  moves: string;
  primaryActionLabel: string;
  socketCount: string;
  soundEnabled: boolean;
  statusMessage: string;
  won?: boolean;
};

export const createGameShellMarkup = ({
  boardAriaLabel = "Puzzle grid with walls, sockets, power cells, and the player",
  boardColumns,
  canUndo,
  levelName,
  levelProgress,
  moves,
  primaryActionLabel,
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
        <div class="briefing" aria-label="Mission and controls">
          <div class="brief-card">
            <p class="label">Mission</p>
            <p class="brief-copy">Route every power cell into a live socket to stabilize the grid.</p>
          </div>
          <div class="brief-card brief-card--controls">
            <p class="label">Controls</p>
            <dl class="control-list">
              <div class="control-row">
                <dt class="control-action">Move</dt>
                <dd class="control-keys">
                  <kbd class="keycap keycap--wide">Arrows</kbd>
                  <span class="control-separator" aria-hidden="true">/</span>
                  <kbd class="keycap keycap--wide">WASD</kbd>
                </dd>
              </div>
              <div class="control-row">
                <dt class="control-action">Undo</dt>
                <dd class="control-keys">
                  <kbd class="keycap">Z</kbd>
                </dd>
              </div>
              <div class="control-row">
                <dt class="control-action">Reset</dt>
                <dd class="control-keys">
                  <kbd class="keycap">R</kbd>
                </dd>
              </div>
              <div class="control-row">
                <dt class="control-action">New run</dt>
                <dd class="control-keys">
                  <kbd class="keycap">N</kbd>
                </dd>
              </div>
            </dl>
          </div>
        </div>
        <p class="sr-only" id="game-board-help">
          Guide the drone with the arrow keys or WASD, push every power cell into a live socket,
          and listen for status updates after each move.
        </p>
        <div class="stats">
          ${createStatCardMarkup({ label: "Moves", value: moves, valueAttributes: "data-moves" })}
          ${createStatCardMarkup({
            label: "Sector",
            value: levelProgress,
            valueAttributes: "data-level-progress",
          })}
          ${createStatCardMarkup({
            label: "Sockets",
            value: socketCount,
            valueAttributes: "data-socket-count",
          })}
        </div>
        <div class="actions">
          ${createControlButtonMarkup({
            label: primaryActionLabel,
            tone: "primary",
            dataAttribute: "data-primary-action",
          })}
          ${createControlButtonMarkup({
            disabled: !canUndo,
            label: "Undo",
            tone: "ghost",
            dataAttribute: "data-undo",
          })}
          ${createControlButtonMarkup({
            ariaPressed: soundEnabled,
            label: soundEnabled ? "Sound on" : "Sound off",
            tone: "ghost",
            dataAttribute: "data-sound",
            visualLabel: "SFX",
          })}
        </div>
      </section>
      <section class="panel board-panel">
        ${createBoardSurfaceMarkup({
          ariaDescribedBy: "game-board-help game-status",
          ariaLabel: boardAriaLabel,
          columns: boardColumns,
          dataAttribute: "data-board",
        })}
        ${createStatusBannerMarkup({
          dataAttribute: "data-status",
          id: "game-status",
          message: statusMessage,
          tone: won ? "won" : "default",
        })}
      </section>
    </main>
  `;
};
