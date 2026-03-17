import { describe, expect, it } from "vitest";

import type { StepResult } from "../game/types";
import { createSoundPlan } from "./sound-player";

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
    const step = createStepResult({ event: "move" });
    const plan = createSoundPlan(step);

    expect(plan).toHaveLength(1);
    expect(plan[0]).toMatchObject({
      kind: "tone",
      frequency: 340,
    });
  });

  it("builds a progressive charge-up and happy finish when a socket powers on", () => {
    const step = createStepResult({
      activatedGoals: [{ x: 3, y: 1 }],
      event: "push",
    });
    const plan = createSoundPlan(step);

    expect(plan[0]).toMatchObject({
      kind: "sweep",
      fromFrequency: 220,
      toFrequency: 520,
    });
    expect(plan.some((action) => action.kind === "tone" && action.frequency === 420)).toBe(true);
    expect(plan.some((action) => action.kind === "tone" && action.frequency === 560)).toBe(true);
    expect(plan.some((action) => action.kind === "tone" && action.frequency === 720)).toBe(true);
    expect(plan.some((action) => action.kind === "tone" && action.frequency === 1040)).toBe(true);
    expect(plan.some((action) => action.kind === "tone" && action.frequency === 1480)).toBe(true);
    expect(plan).toHaveLength(8);
  });

  it("layers a finish flourish for the win event", () => {
    const step = createStepResult({ event: "win" });
    const plan = createSoundPlan(step);

    expect(plan[0]).toMatchObject({
      kind: "sweep",
      fromFrequency: 300,
      toFrequency: 940,
    });
    expect(plan).toHaveLength(4);
  });

  it("uses a short descending cue for undo", () => {
    const step = createStepResult({ event: "undo" });
    const plan = createSoundPlan(step);

    expect(plan).toHaveLength(2);
    expect(plan[0]).toMatchObject({
      kind: "tone",
      frequency: 280,
    });
    expect(plan[1]).toMatchObject({
      kind: "tone",
      frequency: 220,
    });
  });
});
