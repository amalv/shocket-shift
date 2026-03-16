import type { Meta, StoryObj } from "@storybook/html-vite";

import type { StatCardMarkupOptions } from "../design-system/components/stat-card";
import { createStatCardMarkup } from "../design-system/components/stat-card";

const meta = {
  title: "Components/Stat Card",
  tags: ["autodocs"],
  render: (args) => {
    const wrapper = document.createElement("div");

    wrapper.innerHTML = createStatCardMarkup(args);
    return wrapper;
  },
  argTypes: {
    label: { control: "text" },
    value: { control: "text" },
  },
  args: {
    label: "Moves",
    value: "12",
  },
} satisfies Meta<StatCardMarkupOptions>;

export default meta;

type Story = StoryObj<StatCardMarkupOptions>;

export const Moves: Story = {};

export const Sockets: Story = {
  args: {
    label: "Sockets",
    value: "2",
  },
};
