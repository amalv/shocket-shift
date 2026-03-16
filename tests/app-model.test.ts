import { describe, expect, it } from "vitest";

import {
  applyDirectionToModel,
  canUndo,
  createInitialModel,
  resetModel,
  undoModel,
} from "../src/app-model";
import { prototypeLevel } from "../src/game/levels";

describe("app model undo flow", () => {
  it("rewinds the latest successful move", () => {
    // Arrange
    const model = createInitialModel(prototypeLevel);
    const movedModel = applyDirectionToModel(prototypeLevel, model, "left");

    // Act
    const undoneModel = undoModel(prototypeLevel, movedModel);

    // Assert
    expect(canUndo(movedModel)).toBe(true);
    expect(undoneModel.state).toEqual(model.state);
    expect(canUndo(undoneModel)).toBe(false);
    expect(undoneModel.lastStep.event).toBe("undo");
    expect(undoneModel.statusMessage).toBe("Move rewound. Re-route the grid.");
  });

  it("does not add blocked moves to the undo history", () => {
    // Arrange
    const model = createInitialModel(prototypeLevel);
    const movedLeft = applyDirectionToModel(prototypeLevel, model, "left");
    const movedLeftAgain = applyDirectionToModel(prototypeLevel, movedLeft, "left");
    const blockedModel = applyDirectionToModel(prototypeLevel, movedLeftAgain, "up");

    // Act
    const undoneModel = undoModel(prototypeLevel, blockedModel);

    // Assert
    expect(blockedModel.lastStep.event).toBe("blocked");
    expect(undoneModel.state).toEqual(movedLeft.state);
  });

  it("clears undo history when the level resets", () => {
    // Arrange
    const model = createInitialModel(prototypeLevel);
    const movedModel = applyDirectionToModel(prototypeLevel, model, "left");

    // Act
    const reset = resetModel(prototypeLevel, movedModel);

    // Assert
    expect(reset.state.moves).toBe(0);
    expect(canUndo(reset)).toBe(false);
    expect(reset.lastStep.event).toBe("reset");
  });

  it("undoes the winning move and restores the previous puzzle state", () => {
    // Arrange
    const solution = "RRRUULLULDDDDULLLUURRLLDDDDRRRUUUUURUL";
    const directionMap = {
      D: "down",
      L: "left",
      R: "right",
      U: "up",
    } as const;
    let model = createInitialModel(prototypeLevel);

    for (const step of solution.slice(0, -1)) {
      model = applyDirectionToModel(
        prototypeLevel,
        model,
        directionMap[step as keyof typeof directionMap],
      );
    }

    const beforeWinningMove = model;
    const solvedModel = applyDirectionToModel(
      prototypeLevel,
      model,
      directionMap[solution.at(-1) as keyof typeof directionMap],
    );

    // Act
    const undoneModel = undoModel(prototypeLevel, solvedModel);

    // Assert
    expect(solvedModel.state.won).toBe(true);
    expect(undoneModel.state).toEqual(beforeWinningMove.state);
    expect(undoneModel.state.won).toBe(false);
    expect(undoneModel.statusMessage).toBe("Move rewound. Re-route the grid.");
  });
});
