import type { Meta, StoryObj } from "@storybook/html-vite";

import type { GameShellMarkupOptions } from "../design-system/layouts/game-shell";
import { createGameShellMarkup } from "../design-system/layouts/game-shell";

const meta = {
  title: "Layouts/Game Shell",
  tags: ["autodocs"],
  render: (args) => {
    const wrapper = document.createElement("div");

    wrapper.innerHTML = createGameShellMarkup(args);
    return wrapper;
  },
  args: {
    boardColumns: 9,
    canUndo: false,
    levelName: "Prototype 01",
    levelProgress: "1 / 3",
    moves: "0",
    primaryActionLabel: "Reset",
    socketCount: "2",
    soundEnabled: true,
    statusMessage: "Level reset. Systems ready.",
    won: false,
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The shell is the first layout-level contract in the design system. It composes the panel surfaces, stat cards, controls, board frame, and status banner without pulling game engine logic into Storybook.",
      },
    },
  },
} satisfies Meta<GameShellMarkupOptions>;

export default meta;

type Story = StoryObj<GameShellMarkupOptions>;

export const Default: Story = {};

export const WonState: Story = {
  args: {
    canUndo: true,
    moves: "24",
    primaryActionLabel: "Reset",
    soundEnabled: false,
    statusMessage: "Grid stable. Routing the next sector.",
    won: true,
  },
};
