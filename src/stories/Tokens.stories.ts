import type { Meta, StoryObj } from "@storybook/html-vite";

const tokenGroups = [
  {
    name: "Surface",
    tokens: ["--bg-0", "--bg-1", "--bg-2", "--panel", "--panel-border"],
  },
  {
    name: "Text",
    tokens: ["--text", "--muted"],
  },
  {
    name: "Accent",
    tokens: ["--accent-warm", "--accent-hot", "--accent-cool", "--accent-win"],
  },
];

const renderTokenSwatch = (token: string): string => {
  return `
    <div style="display:flex; flex-direction:column; gap:8px; min-width:160px;">
      <div style="height:72px; border-radius:16px; border:1px solid rgba(255,255,255,0.08); background:var(${token});"></div>
      <strong style="font-size:14px;">${token}</strong>
    </div>
  `;
};

const meta = {
  title: "Foundations/Tokens",
  tags: ["autodocs"],
  render: () => {
    const wrapper = document.createElement("div");

    wrapper.style.display = "grid";
    wrapper.style.gap = "24px";
    wrapper.style.padding = "24px";
    wrapper.innerHTML = tokenGroups
      .map(
        (group) => `
          <section style="display:grid; gap:12px;">
            <h2 style="margin:0;">${group.name}</h2>
            <div style="display:flex; flex-wrap:wrap; gap:16px;">
              ${group.tokens.map((token) => renderTokenSwatch(token)).join("")}
            </div>
          </section>
        `,
      )
      .join("");
    return wrapper;
  },
  parameters: {
    docs: {
      description: {
        component:
          "The first token pass stays intentionally small: surfaces, text, and key accents. This keeps the system aligned with Material-style semantic grouping without losing the game's own palette and atmosphere.",
      },
    },
  },
} satisfies Meta;

export default meta;
export const Gallery: StoryObj = {};
