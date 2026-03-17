import { escapeHtml } from "../shared/escape-html";

export type StatusBannerTone = "default" | "won";

export type StatusBannerMarkupOptions = {
  dataAttribute?: string;
  id?: string;
  message: string;
  tone?: StatusBannerTone;
};

export const createStatusBannerMarkup = ({
  dataAttribute,
  id,
  message,
  tone = "default",
}: StatusBannerMarkupOptions): string => {
  const attributes = [
    `class="status status-banner${tone === "won" ? " status-banner--won" : ""}"`,
    'role="status"',
    'aria-live="polite"',
    'aria-atomic="true"',
  ];

  if (id) {
    attributes.push(`id="${escapeHtml(id)}"`);
  }

  if (dataAttribute) {
    attributes.push(dataAttribute);
  }

  return `<div ${attributes.join(" ")}>${escapeHtml(message)}</div>`;
};
