import { describe, expect, it } from "vitest";

import { prototypeLevel } from "../src/game/levels";

describe("prototypeLevel", () => {
  it("exposes the expected prototype metadata", () => {
    // Arrange / Act
    const level = prototypeLevel;

    // Assert
    expect(level.id).toBe("prototype-01");
    expect(level.name).toBe("Prototype 01");
    expect(level.width).toBe(9);
    expect(level.height).toBe(9);
    expect(level.goals).toHaveLength(2);
    expect(level.startingCells).toHaveLength(2);
  });
});
