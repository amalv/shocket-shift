import { describe, expect, it } from "vitest";

import { createControlButtonMarkup } from "../src/design-system/components/button";
import { createStatusBannerMarkup } from "../src/design-system/components/status-banner";
import { createGameShellMarkup } from "../src/design-system/layouts/game-shell";

describe("createControlButtonMarkup", () => {
  it("renders the tone class and pressed state for toggle controls", () => {
    // Arrange
    const options = {
      ariaPressed: true,
      disabled: true,
      label: "Sound on",
      tone: "ghost",
      visualLabel: "SFX",
    } as const;

    // Act
    const markup = createControlButtonMarkup(options);

    // Assert
    expect(markup).toContain('class="control-button control-button--ghost"');
    expect(markup).toContain('aria-pressed="true"');
    expect(markup).toContain('aria-label="Sound on"');
    expect(markup).toContain("disabled");
    expect(markup).toContain(">SFX<");
  });
});

describe("createStatusBannerMarkup", () => {
  it("renders the success modifier when the banner is in a won state", () => {
    // Arrange
    const options = {
      message: "Grid stable. All sockets are powered.",
      tone: "won",
    } as const;

    // Act
    const markup = createStatusBannerMarkup(options);

    // Assert
    expect(markup).toContain("status-banner--won");
    expect(markup).toContain("Grid stable. All sockets are powered.");
  });
});

describe("createGameShellMarkup", () => {
  it("composes the shell with board, stats, controls, and status hooks", () => {
    // Arrange
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

    // Act
    const markup = createGameShellMarkup(options);

    // Assert
    expect(markup).toContain("data-board");
    expect(markup).toContain("data-level-progress");
    expect(markup).toContain("data-moves");
    expect(markup).toContain("data-primary-action");
    expect(markup).toContain("data-undo");
    expect(markup).toContain("data-sound");
    expect(markup).toContain("data-status");
    expect(markup).toContain("Z undo. R reset. N new run.");
    expect(markup).toContain("grid-template-columns: repeat(9, minmax(0, 1fr));");
  });
});
