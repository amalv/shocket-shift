import { escapeHtml } from "../shared/escape-html";

export type BoardSurfaceMarkupOptions = {
  ariaDescribedBy?: string;
  ariaLabel?: string;
  columns: number;
  dataAttribute?: string;
};

export const createBoardSurfaceMarkup = ({
  ariaDescribedBy,
  ariaLabel = "Puzzle grid",
  columns,
  dataAttribute,
}: BoardSurfaceMarkupOptions): string => {
  const attributes = [
    'class="board board-surface"',
    `style="grid-template-columns: repeat(${columns}, minmax(0, 1fr));"`,
    'role="img"',
    `aria-label="${escapeHtml(ariaLabel)}"`,
  ];

  if (ariaDescribedBy) {
    attributes.push(`aria-describedby="${escapeHtml(ariaDescribedBy)}"`);
  }

  if (dataAttribute) {
    attributes.push(dataAttribute);
  }

  return `<div ${attributes.join(" ")}></div>`;
};
