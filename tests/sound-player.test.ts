import { describe, expect, it } from "vitest";

import { createSoundPlan } from "../src/audio/sound-player";
import type { StepResult } from "../src/game/types";

const createStepResult = (overrides: Partial<StepResult>): StepResult => {
  return {
    activatedGoals: [],
    event: "move",
    playerDelta: null,
    pushedCellDelta: null,
    state: {
      cells: [],
      moves: 0,
      player: { x: 0, y: 0 },
      won: false,
    },
    ...overrides,
  };
};

describe("createSoundPlan", () => {
  it("creates a compact tone for a normal move", () => {
    // Arrange
    const step = createStepResult({ event: "move" });

    // Act
    const plan = createSoundPlan(step);

    // Assert
    expect(plan).toHaveLength(1);
    expect(plan[0]).toMatchObject({
      kind: "tone",
      frequency: 340,
    });
  });

  it("adds a layered charge sequence when a socket powers on", () => {
    // Arrange
    const step = createStepResult({
      activatedGoals: [{ x: 3, y: 1 }],
      event: "push",
    });

    // Act
    const plan = createSoundPlan(step);

    // Assert
    expect(plan[0]).toMatchObject({
      kind: "sweep",
      fromFrequency: 210,
      toFrequency: 760,
    });
    expect(plan.some((action) => action.kind === "tone" && action.frequency === 1320)).toBe(true);
    expect(plan).toHaveLength(6);
  });

  it("layers a finish flourish for the win event", () => {
    // Arrange
    const step = createStepResult({ event: "win" });

    // Act
    const plan = createSoundPlan(step);

    // Assert
    expect(plan[0]).toMatchObject({
      kind: "sweep",
      fromFrequency: 300,
      toFrequency: 940,
    });
    expect(plan).toHaveLength(4);
  });
});
