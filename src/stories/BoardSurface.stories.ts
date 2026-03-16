import type { Meta, StoryObj } from "@storybook/html-vite";

import type { BoardSurfaceMarkupOptions } from "../design-system/components/board-surface";
import { createBoardSurfaceMarkup } from "../design-system/components/board-surface";

type BoardSurfaceStoryArgs = BoardSurfaceMarkupOptions & {
  emphasis: "goal" | "none";
  rows: number;
};

const createMockTile = (kind: "floor" | "goal"): string => {
  return `<div class="tile ${kind}"><span class="piece piece-empty"></span></div>`;
};

const getEmphasisIndex = ({
  columns,
  rows,
}: Pick<BoardSurfaceStoryArgs, "columns" | "rows">): number => {
  const centerColumn = Math.floor(columns / 2);
  const centerRow = Math.floor(rows / 2);

  return centerRow * columns + centerColumn;
};

const createMockBoard = ({ columns, emphasis, rows }: BoardSurfaceStoryArgs): string => {
  const boardMarkup = createBoardSurfaceMarkup({
    ariaLabel: "Board surface preview",
    columns,
  });
  const wrapper = document.createElement("div");

  wrapper.innerHTML = boardMarkup;
  const board = wrapper.querySelector(".board");
  const tileCount = columns * rows;
  const emphasisIndex = getEmphasisIndex({ columns, rows });
  const tiles = Array.from({ length: tileCount }, (_, index) => {
    if (emphasis === "goal" && index === emphasisIndex) {
      return createMockTile("goal");
    }

    return createMockTile("floor");
  });

  board?.insertAdjacentHTML("beforeend", tiles.join(""));
  return wrapper.innerHTML;
};

const createStoryFrame = (): HTMLDivElement => {
  const frame = document.createElement("div");
  const previewWidth = Math.max(280, Math.min(420, window.innerWidth - 48));

  frame.style.width = `${previewWidth}px`;
  frame.style.maxWidth = "calc(100vw - 40px)";
  frame.style.padding = "12px";
  frame.style.borderRadius = "24px";
  frame.style.border = "1px solid rgba(200, 215, 228, 0.12)";
  frame.style.background =
    "linear-gradient(180deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01)), rgba(10, 19, 34, 0.76)";
  frame.style.boxShadow = "0 18px 40px rgba(0, 0, 0, 0.22)";

  return frame;
};

const meta = {
  title: "Components/Board Surface",
  tags: ["autodocs"],
  render: (args) => {
    const wrapper = createStoryFrame();

    wrapper.innerHTML = createMockBoard(args);
    return wrapper;
  },
  args: {
    columns: 5,
    emphasis: "none",
    rows: 2,
  },
  argTypes: {
    columns: {
      control: { type: "number", min: 3, max: 9, step: 1 },
    },
    emphasis: {
      control: { type: "inline-radio" },
      options: ["none", "goal"],
    },
    rows: {
      control: { type: "number", min: 2, max: 6, step: 1 },
    },
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "This story documents the board frame as a surface specimen rather than a full puzzle board, so it uses the live preview canvas width well and keeps tile rhythm and socket placement easy to read.",
      },
    },
  },
} satisfies Meta<BoardSurfaceStoryArgs>;

export default meta;

type Story = StoryObj<BoardSurfaceStoryArgs>;

export const Neutral: Story = {};

export const GoalSocket: Story = {
  args: {
    emphasis: "goal",
  },
};
