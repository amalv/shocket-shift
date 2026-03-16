import { describe, expect, it } from "vitest";

import { prototypeLevel } from "../src/game/levels";
import {
  buildBoardSnapshot,
  createGoalActivationEffects,
  getChargeOrigin,
} from "../src/ui/board-view";

describe("buildBoardSnapshot", () => {
  it("projects player and cells onto the level grid", () => {
    // Arrange
    const state = {
      cells: [
        { x: 3, y: 1 },
        { x: 5, y: 3 },
      ],
      moves: 4,
      player: { x: 4, y: 5 },
      won: false,
    };

    // Act
    const snapshot = buildBoardSnapshot(prototypeLevel, state);

    // Assert
    expect(snapshot[1]?.[3]).toMatchObject({
      hasCell: true,
      isCharged: true,
      tile: "goal",
    });
    expect(snapshot[5]?.[4]).toMatchObject({
      hasPlayer: true,
      tile: "floor",
    });
    expect(snapshot[3]?.[5]).toMatchObject({
      hasCell: true,
      isCharged: false,
    });
  });
});

describe("getChargeOrigin", () => {
  it("returns the source side relative to the powered socket", () => {
    // Arrange
    const delta = {
      from: { x: 4, y: 3 },
      to: { x: 5, y: 3 },
    };

    // Act
    const origin = getChargeOrigin(delta);

    // Assert
    expect(origin).toBe("left");
  });
});

describe("createGoalActivationEffects", () => {
  it("maps activated goals to directional charge metadata", () => {
    // Arrange
    const step = {
      activatedGoals: [{ x: 3, y: 1 }],
      event: "push",
      playerDelta: {
        from: { x: 5, y: 1 },
        to: { x: 4, y: 1 },
      },
      pushedCellDelta: {
        from: { x: 4, y: 1 },
        to: { x: 3, y: 1 },
      },
      state: {
        cells: [{ x: 3, y: 1 }],
        moves: 1,
        player: { x: 4, y: 1 },
        won: false,
      },
    } as const;

    // Act
    const effects = createGoalActivationEffects(step);

    // Assert
    expect(effects).toEqual([
      {
        origin: "right",
        point: { x: 3, y: 1 },
      },
    ]);
  });
});
