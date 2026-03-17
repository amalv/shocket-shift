import { describe, expect, it } from "vitest";

import {
  advanceToNextLevel,
  applyDirectionToModel,
  canAdvanceToNextLevel,
  canUndo,
  createInitialModel,
  getActiveLevel,
  isCampaignComplete,
  resetModel,
  restartCampaignModel,
  undoModel,
} from "../src/app-model";
import { campaignLevels, crossCurrentLevel, prototypeLevel } from "../src/game/levels";

const prototypeSolution = "RRRUULLULDDDDULLLUURRLLDDDDRRRUUUUURUL";
const crossCurrentSolution =
  "UUUULLLLLLUURLDDLLUUUURRRRDDDUUULLLLDDRRRLDDRRUUUDDDRRRURDDUUUUULLLLL";

const directionMap = {
  D: "down",
  L: "left",
  R: "right",
  U: "up",
} as const;

describe("app model undo flow", () => {
  it("rewinds the latest successful move", () => {
    // Arrange
    const model = createInitialModel([prototypeLevel]);
    const movedModel = applyDirectionToModel(model, "left");

    // Act
    const undoneModel = undoModel(movedModel);

    // Assert
    expect(canUndo(movedModel)).toBe(true);
    expect(undoneModel.state).toEqual(model.state);
    expect(canUndo(undoneModel)).toBe(false);
    expect(undoneModel.lastStep.event).toBe("undo");
    expect(undoneModel.statusMessage).toBe("Move rewound. Re-route the grid.");
  });

  it("does not add blocked moves to the undo history", () => {
    // Arrange
    const model = createInitialModel([prototypeLevel]);
    const movedLeft = applyDirectionToModel(model, "left");
    const movedLeftAgain = applyDirectionToModel(movedLeft, "left");
    const blockedModel = applyDirectionToModel(movedLeftAgain, "up");

    // Act
    const undoneModel = undoModel(blockedModel);

    // Assert
    expect(blockedModel.lastStep.event).toBe("blocked");
    expect(undoneModel.state).toEqual(movedLeft.state);
  });

  it("clears undo history when the level resets", () => {
    // Arrange
    const model = createInitialModel([prototypeLevel]);
    const movedModel = applyDirectionToModel(model, "left");

    // Act
    const reset = resetModel(movedModel);

    // Assert
    expect(reset.state.moves).toBe(0);
    expect(canUndo(reset)).toBe(false);
    expect(reset.lastStep.event).toBe("reset");
  });

  it("undoes the winning move and restores the previous puzzle state", () => {
    // Arrange
    let model = createInitialModel([prototypeLevel]);

    for (const step of prototypeSolution.slice(0, -1)) {
      model = applyDirectionToModel(model, directionMap[step as keyof typeof directionMap]);
    }

    const beforeWinningMove = model;
    const solvedModel = applyDirectionToModel(
      model,
      directionMap[prototypeSolution.at(-1) as keyof typeof directionMap],
    );

    // Act
    const undoneModel = undoModel(solvedModel);

    // Assert
    expect(solvedModel.state.won).toBe(true);
    expect(undoneModel.state).toEqual(beforeWinningMove.state);
    expect(undoneModel.state.won).toBe(false);
    expect(undoneModel.statusMessage).toBe("Move rewound. Re-route the grid.");
  });
});

describe("app model progression flow", () => {
  it("advances to the next level after a win and resets the board state", () => {
    // Arrange
    const model = solveLevel(createInitialModel(campaignLevels), prototypeSolution);

    // Act
    const advancedModel = advanceToNextLevel(model);

    // Assert
    expect(canAdvanceToNextLevel(model)).toBe(true);
    expect(getActiveLevel(advancedModel).id).toBe(crossCurrentLevel.id);
    expect(advancedModel.activeLevelIndex).toBe(1);
    expect(advancedModel.state.moves).toBe(0);
    expect(canUndo(advancedModel)).toBe(false);
    expect(advancedModel.statusMessage).toBe("Sector 2 online. Systems ready.");
  });

  it("keeps the same state when next level is requested before a win", () => {
    // Arrange
    const model = createInitialModel(campaignLevels);

    // Act
    const advancedModel = advanceToNextLevel(model);

    // Assert
    expect(advancedModel).toBe(model);
    expect(canAdvanceToNextLevel(model)).toBe(false);
  });

  it("flags the campaign as complete on the final solved board", () => {
    // Arrange
    const model = solveLevel(createInitialModel([crossCurrentLevel]), crossCurrentSolution);

    // Assert
    expect(model.state.won).toBe(true);
    expect(isCampaignComplete(model)).toBe(true);
    expect(model.statusMessage).toBe("Grid stable. Every sector is powered.");
  });

  it("restarts the full campaign from sector one without changing the sound state", () => {
    // Arrange
    const baseModel = createInitialModel(campaignLevels);
    const advancedModel = advanceToNextLevel(solveLevel(baseModel, prototypeSolution));
    const mutedModel = { ...advancedModel, soundEnabled: false };

    // Act
    const restartedModel = restartCampaignModel(mutedModel);

    // Assert
    expect(restartedModel.activeLevelIndex).toBe(0);
    expect(getActiveLevel(restartedModel).id).toBe(prototypeLevel.id);
    expect(restartedModel.state.moves).toBe(0);
    expect(restartedModel.soundEnabled).toBe(false);
    expect(restartedModel.statusMessage).toBe("New run loaded. Systems ready.");
  });
});

function solveLevel(initialModel: ReturnType<typeof createInitialModel>, solution: string) {
  let model = initialModel;

  for (const step of solution) {
    model = applyDirectionToModel(model, directionMap[step as keyof typeof directionMap]);
  }

  return model;
}
