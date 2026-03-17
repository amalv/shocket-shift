import { describe, expect, it } from "vitest";

import { createInitialState, stepGame } from "./engine";
import { prototypeLevel } from "./levels";

describe("stepGame", () => {
  it("moves the player into an open tile", () => {
    const state = createInitialState(prototypeLevel);
    const result = stepGame(prototypeLevel, state, "left");

    expect(result.event).toBe("move");
    expect(result.state.player).toEqual({ x: 3, y: 5 });
    expect(result.state.moves).toBe(1);
  });

  it("blocks movement into a wall without incrementing moves", () => {
    const state = createInitialState(prototypeLevel);
    const movedState = stepGame(prototypeLevel, state, "left").state;
    const wallAdjacentState = stepGame(prototypeLevel, movedState, "left").state;
    const result = stepGame(prototypeLevel, wallAdjacentState, "up");

    expect(result.event).toBe("blocked");
    expect(result.state.player).toEqual(wallAdjacentState.player);
    expect(result.state.moves).toBe(wallAdjacentState.moves);
  });

  it("pushes a cell when the destination tile is free", () => {
    const state = {
      cells: [
        { x: 3, y: 3 },
        { x: 5, y: 3 },
      ],
      moves: 5,
      player: { x: 6, y: 3 },
      won: false,
    };

    const result = stepGame(prototypeLevel, state, "left");

    expect(result.event).toBe("push");
    expect(result.state.player).toEqual({ x: 5, y: 3 });
    expect(result.state.cells).toContainEqual({ x: 4, y: 3 });
    expect(result.pushedCellDelta).toEqual({
      from: { x: 5, y: 3 },
      to: { x: 4, y: 3 },
    });
  });

  it("reports when a goal becomes powered during a push", () => {
    const state = {
      cells: [
        { x: 4, y: 1 },
        { x: 5, y: 3 },
      ],
      moves: 7,
      player: { x: 5, y: 1 },
      won: false,
    };

    const result = stepGame(prototypeLevel, state, "left");

    expect(result.activatedGoals).toEqual([{ x: 3, y: 1 }]);
  });

  it("marks the game as won when the final goal is filled", () => {
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

    expect(state.won).toBe(true);
    expect(state.cells).toContainEqual({ x: 3, y: 1 });
    expect(state.cells).toContainEqual({ x: 5, y: 7 });
  });
});
