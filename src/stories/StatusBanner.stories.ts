import type { Meta, StoryObj } from "@storybook/html-vite";

import type { StatusBannerMarkupOptions } from "../design-system/components/status-banner";
import { createStatusBannerMarkup } from "../design-system/components/status-banner";

const STATUS_BANNER_STORY_WIDTH = "640px";

const meta = {
  title: "Components/Status Banner",
  tags: ["autodocs"],
  render: (args) => {
    const wrapper = document.createElement("div");

    wrapper.style.width = STATUS_BANNER_STORY_WIDTH;
    wrapper.style.maxWidth = "100%";
    wrapper.innerHTML = createStatusBannerMarkup(args);
    return wrapper;
  },
  argTypes: {
    message: { control: "text" },
    tone: {
      control: { type: "inline-radio" },
      options: ["default", "won"],
    },
  },
  args: {
    message: "Level reset. Systems ready.",
    tone: "default",
  },
  parameters: {
    layout: "padded",
  },
} satisfies Meta<StatusBannerMarkupOptions>;

export default meta;

type Story = StoryObj<StatusBannerMarkupOptions>;

export const Default: Story = {};

export const Success: Story = {
  args: {
    message: "Grid stable. All sockets are powered.",
    tone: "won",
  },
};
