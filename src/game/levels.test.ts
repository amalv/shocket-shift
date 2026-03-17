import { describe, expect, it } from "vitest";

import { campaignLevels, crossCurrentLevel, prototypeLevel, relaySpineLevel } from "./levels";

describe("prototypeLevel", () => {
  it("exposes the expected prototype metadata", () => {
    const level = prototypeLevel;

    expect(level.id).toBe("prototype-01");
    expect(level.name).toBe("Prototype 01");
    expect(level.width).toBe(9);
    expect(level.height).toBe(9);
    expect(level.goals).toHaveLength(2);
    expect(level.startingCells).toHaveLength(2);
  });
});

describe("campaignLevels", () => {
  it("orders the shipped campaign from prototype through the final relay board", () => {
    const levels = campaignLevels;

    expect(levels).toHaveLength(3);
    expect(levels[0]?.id).toBe(prototypeLevel.id);
    expect(levels[1]?.id).toBe(crossCurrentLevel.id);
    expect(levels[2]?.id).toBe(relaySpineLevel.id);
  });

  it("includes the expected metadata for the additional handcrafted boards", () => {
    expect(crossCurrentLevel.width).toBe(11);
    expect(crossCurrentLevel.goals).toHaveLength(2);
    expect(crossCurrentLevel.startingCells).toHaveLength(2);
    expect(crossCurrentLevel.startingCells).toContainEqual({ x: 2, y: 3 });
    expect(crossCurrentLevel.startingCells).toContainEqual({ x: 4, y: 3 });
    expect(relaySpineLevel.width).toBe(11);
    expect(relaySpineLevel.goals).toHaveLength(3);
    expect(relaySpineLevel.startingCells).toHaveLength(3);
    expect(relaySpineLevel.startingCells).toContainEqual({ x: 9, y: 3 });
    expect(relaySpineLevel.startingCells).toContainEqual({ x: 3, y: 4 });
    expect(relaySpineLevel.startingCells).toContainEqual({ x: 2, y: 6 });
  });
});
