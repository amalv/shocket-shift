import { escapeHtml } from "../shared/escape-html";

export type ControlButtonTone = "ghost" | "primary";

export type ControlButtonMarkupOptions = {
  ariaPressed?: boolean;
  dataAttribute?: string;
  disabled?: boolean;
  label: string;
  tone?: ControlButtonTone;
  visualLabel?: string;
};

export const createControlButtonMarkup = ({
  ariaPressed,
  dataAttribute,
  disabled = false,
  label,
  tone = "primary",
  visualLabel,
}: ControlButtonMarkupOptions): string => {
  const attributes = ['type="button"', `class="control-button control-button--${tone}"`];

  if (dataAttribute) {
    attributes.push(dataAttribute);
  }

  if (typeof ariaPressed === "boolean") {
    attributes.push(`aria-pressed="${String(ariaPressed)}"`);
  }

  if (visualLabel && visualLabel !== label) {
    attributes.push(`aria-label="${escapeHtml(label)}"`);
    attributes.push(`title="${escapeHtml(label)}"`);
  }

  if (disabled) {
    attributes.push("disabled");
  }

  return `<button ${attributes.join(" ")}>${escapeHtml(visualLabel ?? label)}</button>`;
};
