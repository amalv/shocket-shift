import { escapeHtml } from "../shared/escape-html";

export type StatusBannerTone = "default" | "won";

export type StatusBannerMarkupOptions = {
  dataAttribute?: string;
  message: string;
  tone?: StatusBannerTone;
};

export const createStatusBannerMarkup = ({
  dataAttribute,
  message,
  tone = "default",
}: StatusBannerMarkupOptions): string => {
  const attributes = [`class="status status-banner${tone === "won" ? " status-banner--won" : ""}"`];

  if (dataAttribute) {
    attributes.push(dataAttribute);
  }

  return `<div ${attributes.join(" ")}>${escapeHtml(message)}</div>`;
};
