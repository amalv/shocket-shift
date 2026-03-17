import { type Locator, type Page, expect, test } from "@playwright/test";

const levelOneSolution = "RRRUULLULDDDDULLLUURRLLDDDDRRRUUUUURUL";
const levelTwoSolution = "UUUULLLLLLUURLDDLLUUUURRRRDDDUUULLLLDDRRRLDDRRUUUDDDRRRURDDUUUUULLLLL";
const levelThreeSolution =
  "LUULLUUUURRRRDDDDLLLLLLUDLLUURRRLDDRRUUUDDDLLLLDDRULURRRLUURRDDDDDURRRRDDLLLLLRUUUURRRRDUUUUULLLLL";
const nextLevelStatus = "Sector 2 online. Systems ready.";

const keyByStep = {
  D: "ArrowDown",
  L: "ArrowLeft",
  R: "ArrowRight",
  U: "ArrowUp",
} as const;

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Socket Shift" })).toBeVisible();
  await expect(page.locator("[data-level-progress]")).toHaveText("1 / 3");
  await expect(page.locator("[data-status]")).toHaveText("Level reset. Systems ready.");
  await expectUndoEnabled(page, false);
});

test("supports undo from the button and keyboard after successful moves", async ({ page }) => {
  await disableSound(page);

  await page.keyboard.press("a");
  await expectMoves(page, 1);
  await expectPlayerAt(page, 3, 5);
  await expectUndoEnabled(page, true);
  await expect(page.locator("[data-status]")).toHaveText("Keep the 2 sockets in sight.");

  await page.getByRole("button", { name: "Undo" }).click();
  await expectMoves(page, 0);
  await expectPlayerAt(page, 4, 5);
  await expectUndoEnabled(page, false);
  await expect(page.locator("[data-status]")).toHaveText("Move rewound. Re-route the grid.");

  await page.keyboard.press("ArrowLeft");
  await page.keyboard.press("ArrowLeft");
  await expectMoves(page, 2);
  await expectPlayerAt(page, 2, 5);
  await expectUndoEnabled(page, true);

  await page.keyboard.press("z");
  await expectMoves(page, 1);
  await expectPlayerAt(page, 3, 5);
  await expectUndoEnabled(page, true);
});

test("still reports blocked routes without burning moves or adding undo entries", async ({
  page,
}) => {
  await disableSound(page);

  await page.keyboard.press("ArrowLeft");
  await page.keyboard.press("ArrowLeft");
  await expectUndoEnabled(page, true);

  await page.keyboard.press("w");
  await expectMoves(page, 2);
  await expectPlayerAt(page, 2, 5);
  await expect(page.locator("[data-status]")).toHaveText(
    "That route is jammed. Try another angle.",
  );

  await page.keyboard.press("z");
  await expectMoves(page, 1);
  await expectPlayerAt(page, 3, 5);
});

test("resets the board cleanly and preserves the chosen sound state", async ({ page }) => {
  const soundButton = page.locator("[data-sound]");

  await soundButton.click();
  await expect(soundButton).toHaveAttribute("aria-pressed", "false");
  await expect(soundButton).toHaveText("SFX");
  await expect(soundButton).toHaveAttribute("aria-label", "Sound off");

  await page.keyboard.press("ArrowLeft");
  await expectMoves(page, 1);
  await expectPlayerAt(page, 3, 5);
  await expectUndoEnabled(page, true);

  await page.locator("[data-primary-action]").click();

  await expectMoves(page, 0);
  await expectPlayerAt(page, 4, 5);
  await expectUndoEnabled(page, false);
  await expectCellAt(page, 3, 3);
  await expectCellAt(page, 5, 3);
  await expect(page.locator("[data-status]")).toHaveText("Level reset. Systems ready.");
  await expect(soundButton).toHaveAttribute("aria-pressed", "false");
  await expect(soundButton).toHaveText("SFX");
  await expect(soundButton).toHaveAttribute("aria-label", "Sound off");
});

test("allows the winning move to be undone after the level is solved", async ({ page }) => {
  await disableSound(page);

  for (const step of levelOneSolution) {
    await page.keyboard.press(keyByStep[step as keyof typeof keyByStep]);
  }

  await expectMoves(page, levelOneSolution.length);
  await expect(page.locator("[data-status]")).toHaveText("Grid stable. Routing the next sector.");
  await expect(page.locator("[data-status]")).toHaveClass(/won/);
  await expect(tile(page, 3, 1)).toHaveClass(/charged/);
  await expect(tile(page, 5, 7)).toHaveClass(/charged/);
  await expect(page.locator("[data-board] .tile.goal.charged")).toHaveCount(2);

  await page.keyboard.press("z");

  await expect(page.locator("[data-level-progress]")).toHaveText("1 / 3");
  await expectMoves(page, levelOneSolution.length - 1);
  await expect(page.locator("[data-status]")).toHaveText("Move rewound. Re-route the grid.");
  await expect(page.locator("[data-status]")).not.toHaveClass(/won/);
  await expect(tile(page, 3, 1)).not.toHaveClass(/charged/);
  await expect(tile(page, 5, 7)).toHaveClass(/charged/);
  await expect(page.locator("[data-board] .tile.goal.charged")).toHaveCount(1);
});

test("auto-loads the next level after a win", async ({ page }) => {
  await disableSound(page);

  for (const step of levelOneSolution) {
    await page.keyboard.press(keyByStep[step as keyof typeof keyByStep]);
  }

  await expect(page.locator("[data-level-progress]")).toHaveText("2 / 3");
  await expect(page.locator(".eyebrow")).toHaveText("Cross Current");
  await expect(page.locator("[data-status]")).toHaveText(nextLevelStatus);
  await expectMoves(page, 0);
  await expectUndoEnabled(page, false);
  await expectPlayerAt(page, 9, 9);
  await expectCellAt(page, 2, 3);
  await expectCellAt(page, 4, 3);
});

test("keeps the desktop shell within one viewport without horizontal or vertical scrolling", async ({
  page,
}) => {
  for (const viewport of [
    { width: 1280, height: 720 },
    { width: 1366, height: 768 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/");

    const overflow = await page.evaluate(() => {
      return {
        horizontal: document.documentElement.scrollWidth > window.innerWidth,
        vertical: document.documentElement.scrollHeight > window.innerHeight,
      };
    });

    expect(overflow.horizontal).toBe(false);
    expect(overflow.vertical).toBe(false);
  }
});

test("exposes onboarding copy and live status semantics without expanding the shell", async ({
  page,
}) => {
  const board = page.locator("[data-board]");
  const status = page.locator("[data-status]");

  await expect(page.getByText("Mission")).toBeVisible();
  await expect(page.getByText("Controls")).toBeVisible();
  await expect(
    page.getByText("Route every power cell into a live socket to stabilize the grid."),
  ).toBeVisible();
  await expect(status).toHaveAttribute("role", "status");
  await expect(status).toHaveAttribute("aria-live", "polite");
  await expect(status).toHaveAttribute("aria-atomic", "true");
  await expect(board).toHaveAttribute("aria-describedby", "game-board-help game-status");
});

test("offers a new game restart after the full campaign is cleared", async ({ page }) => {
  await disableSound(page);

  for (const step of levelOneSolution) {
    await page.keyboard.press(keyByStep[step as keyof typeof keyByStep]);
  }

  await expect(page.locator("[data-level-progress]")).toHaveText("2 / 3");

  for (const step of levelTwoSolution) {
    await page.keyboard.press(keyByStep[step as keyof typeof keyByStep]);
  }

  await expect(page.locator("[data-level-progress]")).toHaveText("3 / 3");

  for (const step of levelThreeSolution) {
    await page.keyboard.press(keyByStep[step as keyof typeof keyByStep]);
  }

  const primaryActionButton = page.locator("[data-primary-action]");

  await expect(page.locator("[data-status]")).toHaveText("Grid stable. Every sector is powered.");
  await expect(primaryActionButton).toHaveText("New Game");

  await primaryActionButton.click();

  await expect(page.locator("[data-level-progress]")).toHaveText("1 / 3");
  await expect(page.locator(".eyebrow")).toHaveText("Prototype 01");
  await expect(page.locator("[data-status]")).toHaveText("New run loaded. Systems ready.");
  await expect(primaryActionButton).toHaveText("Reset");
});

async function disableSound(page: Page): Promise<void> {
  const soundButton = page.locator("[data-sound]");

  await soundButton.click();
  await expect(soundButton).toHaveAttribute("aria-pressed", "false");
  await expect(soundButton).toHaveText("SFX");
  await expect(soundButton).toHaveAttribute("aria-label", "Sound off");
}

async function expectMoves(page: Page, moves: number): Promise<void> {
  await expect(page.locator("[data-moves]")).toHaveText(String(moves));
}

async function expectPlayerAt(page: Page, x: number, y: number): Promise<void> {
  await expect(pieceAt(page, x, y)).toHaveAttribute("data-kind", "player");
}

async function expectCellAt(page: Page, x: number, y: number): Promise<void> {
  await expect(pieceAt(page, x, y)).toHaveAttribute("data-kind", "cell");
}

async function expectUndoEnabled(page: Page, enabled: boolean): Promise<void> {
  const undoButton = page.locator("[data-undo]");

  if (enabled) {
    await expect(undoButton).toBeEnabled();
    return;
  }

  await expect(undoButton).toBeDisabled();
}

function pieceAt(page: Page, x: number, y: number): Locator {
  return tile(page, x, y).locator(".piece");
}

function tile(page: Page, x: number, y: number): Locator {
  return page.locator(`[data-board] [data-x="${x}"][data-y="${y}"]`);
}
