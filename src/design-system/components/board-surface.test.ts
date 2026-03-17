import { describe, expect, it } from "vitest";

import { createBoardSurfaceMarkup } from "./board-surface";

describe("createBoardSurfaceMarkup", () => {
  it("renders the board label and accessible description wiring", () => {
    const markup = createBoardSurfaceMarkup({
      ariaDescribedBy: "game-board-help game-status",
      ariaLabel: "Puzzle grid with goals and power cells",
      columns: 9,
      dataAttribute: "data-board",
    });

    expect(markup).toContain('role="img"');
    expect(markup).toContain('aria-label="Puzzle grid with goals and power cells"');
    expect(markup).toContain('aria-describedby="game-board-help game-status"');
    expect(markup).toContain("data-board");
  });
});
