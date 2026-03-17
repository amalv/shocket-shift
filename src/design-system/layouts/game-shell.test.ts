import { describe, expect, it } from "vitest";

import { createGameShellMarkup } from "./game-shell";

describe("createGameShellMarkup", () => {
  it("composes the shell with board, stats, controls, and status hooks", () => {
    const options = {
      boardColumns: 9,
      canUndo: false,
      levelName: "Prototype 01",
      levelProgress: "1 / 3",
      moves: "0",
      primaryActionLabel: "Reset",
      socketCount: "2",
      soundEnabled: true,
      statusMessage: "Level reset. Systems ready.",
    } as const;

    const markup = createGameShellMarkup(options);

    expect(markup).toContain("data-board");
    expect(markup).toContain("data-level-progress");
    expect(markup).toContain("data-moves");
    expect(markup).toContain("data-primary-action");
    expect(markup).toContain("data-undo");
    expect(markup).toContain("data-sound");
    expect(markup).toContain("data-status");
    expect(markup).toContain("Mission");
    expect(markup).toContain("Controls");
    expect(markup).toContain("Route every power cell into a live socket to stabilize the grid.");
    expect(markup).toContain('<kbd class="keycap">Z</kbd>');
    expect(markup).toContain('<kbd class="keycap keycap--wide">Arrows</kbd>');
    expect(markup).toContain('id="game-board-help"');
    expect(markup).toContain('aria-describedby="game-board-help game-status"');
    expect(markup).toContain('id="game-status"');
    expect(markup).toContain("grid-template-columns: repeat(9, minmax(0, 1fr));");
  });
});
