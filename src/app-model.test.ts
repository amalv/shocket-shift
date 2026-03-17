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
} from "./app-model";
import { campaignLevels, crossCurrentLevel, prototypeLevel } from "./game/levels";

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
    const model = createInitialModel([prototypeLevel]);
    const movedModel = applyDirectionToModel(model, "left");
    const undoneModel = undoModel(movedModel);

    expect(canUndo(movedModel)).toBe(true);
    expect(undoneModel.state).toEqual(model.state);
    expect(canUndo(undoneModel)).toBe(false);
    expect(undoneModel.lastStep.event).toBe("undo");
    expect(undoneModel.statusMessage).toBe("Move rewound. Re-route the grid.");
  });

  it("does not add blocked moves to the undo history", () => {
    const model = createInitialModel([prototypeLevel]);
    const movedLeft = applyDirectionToModel(model, "left");
    const movedLeftAgain = applyDirectionToModel(movedLeft, "left");
    const blockedModel = applyDirectionToModel(movedLeftAgain, "up");
    const undoneModel = undoModel(blockedModel);

    expect(blockedModel.lastStep.event).toBe("blocked");
    expect(undoneModel.state).toEqual(movedLeft.state);
  });

  it("clears undo history when the level resets", () => {
    const model = createInitialModel([prototypeLevel]);
    const movedModel = applyDirectionToModel(model, "left");
    const reset = resetModel(movedModel);

    expect(reset.state.moves).toBe(0);
    expect(canUndo(reset)).toBe(false);
    expect(reset.lastStep.event).toBe("reset");
  });

  it("undoes the winning move and restores the previous puzzle state", () => {
    let model = createInitialModel([prototypeLevel]);

    for (const step of prototypeSolution.slice(0, -1)) {
      model = applyDirectionToModel(model, directionMap[step as keyof typeof directionMap]);
    }

    const beforeWinningMove = model;
    const solvedModel = applyDirectionToModel(
      model,
      directionMap[prototypeSolution.at(-1) as keyof typeof directionMap],
    );
    const undoneModel = undoModel(solvedModel);

    expect(solvedModel.state.won).toBe(true);
    expect(undoneModel.state).toEqual(beforeWinningMove.state);
    expect(undoneModel.state.won).toBe(false);
    expect(undoneModel.statusMessage).toBe("Move rewound. Re-route the grid.");
  });
});

describe("app model progression flow", () => {
  it("advances to the next level after a win and resets the board state", () => {
    const model = solveLevel(createInitialModel(campaignLevels), prototypeSolution);
    const advancedModel = advanceToNextLevel(model);

    expect(canAdvanceToNextLevel(model)).toBe(true);
    expect(getActiveLevel(advancedModel).id).toBe(crossCurrentLevel.id);
    expect(advancedModel.activeLevelIndex).toBe(1);
    expect(advancedModel.state.moves).toBe(0);
    expect(canUndo(advancedModel)).toBe(false);
    expect(advancedModel.statusMessage).toBe("Sector 2 online. Systems ready.");
  });

  it("keeps the same state when next level is requested before a win", () => {
    const model = createInitialModel(campaignLevels);
    const advancedModel = advanceToNextLevel(model);

    expect(advancedModel).toBe(model);
    expect(canAdvanceToNextLevel(model)).toBe(false);
  });

  it("flags the campaign as complete on the final solved board", () => {
    const model = solveLevel(createInitialModel([crossCurrentLevel]), crossCurrentSolution);

    expect(model.state.won).toBe(true);
    expect(isCampaignComplete(model)).toBe(true);
    expect(model.statusMessage).toBe("Grid stable. Every sector is powered.");
  });

  it("restarts the full campaign from sector one without changing the sound state", () => {
    const baseModel = createInitialModel(campaignLevels);
    const advancedModel = advanceToNextLevel(solveLevel(baseModel, prototypeSolution));
    const mutedModel = { ...advancedModel, soundEnabled: false };
    const restartedModel = restartCampaignModel(mutedModel);

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
