import { escapeHtml } from "../shared/escape-html";

export type BoardSurfaceMarkupOptions = {
  ariaLabel?: string;
  columns: number;
  dataAttribute?: string;
};

export const createBoardSurfaceMarkup = ({
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

  if (dataAttribute) {
    attributes.push(dataAttribute);
  }

  return `<div ${attributes.join(" ")}></div>`;
};
