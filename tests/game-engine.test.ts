import { describe, expect, it } from "vitest";

import { createInitialState, stepGame } from "../src/game/engine";
import { prototypeLevel } from "../src/game/levels";

describe("stepGame", () => {
  it("moves the player into an open tile", () => {
    // Arrange
    const state = createInitialState(prototypeLevel);

    // Act
    const result = stepGame(prototypeLevel, state, "left");

    // Assert
    expect(result.event).toBe("move");
    expect(result.state.player).toEqual({ x: 3, y: 5 });
    expect(result.state.moves).toBe(1);
  });

  it("blocks movement into a wall without incrementing moves", () => {
    // Arrange
    const state = createInitialState(prototypeLevel);
    const movedState = stepGame(prototypeLevel, state, "left").state;
    const wallAdjacentState = stepGame(prototypeLevel, movedState, "left").state;

    // Act
    const result = stepGame(prototypeLevel, wallAdjacentState, "up");

    // Assert
    expect(result.event).toBe("blocked");
    expect(result.state.player).toEqual(wallAdjacentState.player);
    expect(result.state.moves).toBe(wallAdjacentState.moves);
  });

  it("pushes a cell when the destination tile is free", () => {
    // Arrange
    const state = {
      cells: [
        { x: 3, y: 3 },
        { x: 5, y: 3 },
      ],
      moves: 5,
      player: { x: 6, y: 3 },
      won: false,
    };

    // Act
    const result = stepGame(prototypeLevel, state, "left");

    // Assert
    expect(result.event).toBe("push");
    expect(result.state.player).toEqual({ x: 5, y: 3 });
    expect(result.state.cells).toContainEqual({ x: 4, y: 3 });
    expect(result.pushedCellDelta).toEqual({
      from: { x: 5, y: 3 },
      to: { x: 4, y: 3 },
    });
  });

  it("reports when a goal becomes powered during a push", () => {
    // Arrange
    const state = {
      cells: [
        { x: 4, y: 1 },
        { x: 5, y: 3 },
      ],
      moves: 7,
      player: { x: 5, y: 1 },
      won: false,
    };

    // Act
    const result = stepGame(prototypeLevel, state, "left");

    // Assert
    expect(result.activatedGoals).toEqual([{ x: 3, y: 1 }]);
  });

  it("marks the game as won when the final goal is filled", () => {
    // Arrange
    const solution = "RRRUULLULDDDDULLLUURRLLDDDDRRRUUUUURUL";
    let state = createInitialState(prototypeLevel);

    for (const step of solution) {
      const directionMap = {
        D: "down",
        L: "left",
        R: "right",
        U: "up",
      } as const;

      state = stepGame(
        prototypeLevel,
        state,
        directionMap[step as keyof typeof directionMap],
      ).state;
    }

    // Act
    const result = state;

    // Assert
    expect(result.won).toBe(true);
    expect(result.cells).toContainEqual({ x: 3, y: 1 });
    expect(result.cells).toContainEqual({ x: 5, y: 7 });
  });
});
