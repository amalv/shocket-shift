import { describe, expect, it } from "vitest";

import { createControlButtonMarkup } from "./button";

describe("createControlButtonMarkup", () => {
  it("renders the tone class and pressed state for toggle controls", () => {
    const options = {
      ariaPressed: true,
      disabled: true,
      label: "Sound on",
      tone: "ghost",
      visualLabel: "SFX",
    } as const;

    const markup = createControlButtonMarkup(options);

    expect(markup).toContain('class="control-button control-button--ghost"');
    expect(markup).toContain('aria-pressed="true"');
    expect(markup).toContain('aria-label="Sound on"');
    expect(markup).toContain("disabled");
    expect(markup).toContain(">SFX<");
  });
});
