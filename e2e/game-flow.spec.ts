import { type Locator, type Page, expect, test } from "@playwright/test";

const solution = "RRRUULLULDDDDULLLUURRLLDDDDRRRUUUUURUL";

const keyByStep = {
  D: "ArrowDown",
  L: "ArrowLeft",
  R: "ArrowRight",
  U: "ArrowUp",
} as const;

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Socket Shift" })).toBeVisible();
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

  await page.getByRole("button", { name: "Undo move" }).click();
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
  await expect(soundButton).toHaveText("Sound off");

  await page.keyboard.press("ArrowLeft");
  await expectMoves(page, 1);
  await expectPlayerAt(page, 3, 5);
  await expectUndoEnabled(page, true);

  await page.getByRole("button", { name: "Reset level" }).click();

  await expectMoves(page, 0);
  await expectPlayerAt(page, 4, 5);
  await expectUndoEnabled(page, false);
  await expectCellAt(page, 3, 3);
  await expectCellAt(page, 5, 3);
  await expect(page.locator("[data-status]")).toHaveText("Level reset. Systems ready.");
  await expect(soundButton).toHaveAttribute("aria-pressed", "false");
  await expect(soundButton).toHaveText("Sound off");
});

test("allows the winning move to be undone after the level is solved", async ({ page }) => {
  await disableSound(page);

  for (const step of solution) {
    await page.keyboard.press(keyByStep[step as keyof typeof keyByStep]);
  }

  await expectMoves(page, solution.length);
  await expect(page.locator("[data-status]")).toHaveText("Grid stable. All sockets are powered.");
  await expect(page.locator("[data-status]")).toHaveClass(/won/);
  await expect(tile(page, 3, 1)).toHaveClass(/charged/);
  await expect(tile(page, 5, 7)).toHaveClass(/charged/);
  await expect(page.locator("[data-board] .tile.goal.charged")).toHaveCount(2);

  await page.keyboard.press("z");

  await expectMoves(page, solution.length - 1);
  await expect(page.locator("[data-status]")).toHaveText("Move rewound. Re-route the grid.");
  await expect(page.locator("[data-status]")).not.toHaveClass(/won/);
  await expect(tile(page, 3, 1)).not.toHaveClass(/charged/);
  await expect(tile(page, 5, 7)).toHaveClass(/charged/);
  await expect(page.locator("[data-board] .tile.goal.charged")).toHaveCount(1);
});

async function disableSound(page: Page): Promise<void> {
  const soundButton = page.locator("[data-sound]");

  await soundButton.click();
  await expect(soundButton).toHaveAttribute("aria-pressed", "false");
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
