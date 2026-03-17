import { describe, expect, it } from "vitest";

import { createStatusBannerMarkup } from "./status-banner";

describe("createStatusBannerMarkup", () => {
  it("renders the success modifier when the banner is in a won state", () => {
    const options = {
      id: "game-status",
      message: "Grid stable. All sockets are powered.",
      tone: "won",
    } as const;

    const markup = createStatusBannerMarkup(options);

    expect(markup).toContain('role="status"');
    expect(markup).toContain('aria-live="polite"');
    expect(markup).toContain('aria-atomic="true"');
    expect(markup).toContain('id="game-status"');
    expect(markup).toContain("status-banner--won");
    expect(markup).toContain("Grid stable. All sockets are powered.");
  });
});
