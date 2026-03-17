import type { Meta, StoryObj } from "@storybook/html-vite";
import { fn } from "storybook/test";

import type { ControlButtonMarkupOptions } from "../design-system/components/button";
import { createControlButtonMarkup } from "../design-system/components/button";

type ButtonStoryArgs = ControlButtonMarkupOptions & {
  onClick?: () => void;
};

const meta = {
  title: "Components/Control Button",
  tags: ["autodocs"],
  render: ({ onClick, ...args }) => {
    const wrapper = document.createElement("div");

    wrapper.innerHTML = createControlButtonMarkup(args);
    const button = wrapper.querySelector("button");

    if (button && onClick) {
      button.addEventListener("click", onClick);
    }

    return wrapper;
  },
  argTypes: {
    tone: {
      control: { type: "inline-radio" },
      options: ["primary", "ghost"],
    },
    label: { control: "text" },
  },
  args: {
    label: "Reset",
    onClick: fn(),
    tone: "primary",
  },
  parameters: {
    docs: {
      description: {
        component:
          "Primary and ghost controls used in the game shell. These stay intentionally narrow: one tone for the main action, one tone for secondary controls.",
      },
    },
  },
} satisfies Meta<ButtonStoryArgs>;

export default meta;

type Story = StoryObj<ButtonStoryArgs>;

export const Primary: Story = {};

export const Ghost: Story = {
  args: {
    label: "Sound on",
    tone: "ghost",
    visualLabel: "SFX",
  },
};

export const SoundEnabled: Story = {
  args: {
    ariaPressed: true,
    label: "Sound on",
    tone: "ghost",
    visualLabel: "SFX",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Pressed is only meaningful for toggle-like secondary actions. In the game shell this is used for stateful controls such as sound enabled.",
      },
    },
  },
};
