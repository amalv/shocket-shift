import { escapeHtml } from "../shared/escape-html";

export type StatCardMarkupOptions = {
  label: string;
  value: string;
  valueAttributes?: string;
};

export const createStatCardMarkup = ({
  label,
  value,
  valueAttributes,
}: StatCardMarkupOptions): string => {
  const attributes = valueAttributes ? ` ${valueAttributes}` : "";

  return `
    <div class="stat-card">
      <span class="label">${escapeHtml(label)}</span>
      <strong class="stat-card__value"${attributes}>${escapeHtml(value)}</strong>
    </div>
  `;
};
