import { describe, expect, it } from "vitest";

import { prototypeLevel } from "../src/game/levels";
import { buildBoardSnapshot } from "../src/ui/board-view";

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
