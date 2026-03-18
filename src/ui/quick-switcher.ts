import type { PickerItem } from "../model/picker-item";
import quickSwitcherCss from "../styles/quick-switcher.css?inline";

const fallbackQuickSwitcherCss = `
.linktray-overlay {
  position: fixed;
  inset: 0;
  z-index: 10001;
  display: grid;
  place-items: start center;
  padding: clamp(3rem, 10vh, 7rem) 1rem 1.5rem;
  background:
    linear-gradient(to bottom, rgba(237, 241, 247, 0.78), rgba(237, 241, 247, 0.88));
  backdrop-filter: blur(6px);
}

.linktray-panel {
  width: min(43rem, 100%);
  max-height: min(78vh, 42rem);
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr);
  border: 1px solid rgba(63, 77, 93, 0.14);
  border-radius: 18px;
  background: rgb(246, 249, 252);
  font-family:
    "SF Pro Text",
    "SF Pro Display",
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
  box-shadow:
    0 22px 52px rgba(26, 38, 52, 0.12),
    0 1px 0 rgba(255, 255, 255, 0.7) inset;
  overflow: hidden;
}

.linktray-toolbar {
  display: grid;
  gap: 0.28rem;
  padding: 0.82rem 0.98rem 0.72rem;
  border-bottom: 1px solid rgba(63, 77, 93, 0.1);
  background:
    linear-gradient(to bottom, rgba(255, 255, 255, 0.8), rgba(243, 246, 250, 0.92));
}

.linktray-toolbar__eyebrow {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(78, 95, 114, 0.82);
}

.linktray-toolbar__headline {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
}

.linktray-toolbar__title {
  margin: 0;
  font-size: clamp(0.98rem, 0.92rem + 0.36vw, 1.12rem);
  font-weight: 640;
  letter-spacing: -0.015em;
  color: rgb(19, 31, 44);
}

.linktray-toolbar__count {
  font-size: 0.75rem;
  color: rgba(72, 88, 106, 0.86);
  font-variant-numeric: tabular-nums;
}

.linktray-searchRow {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 0.62rem;
  padding: 0.72rem 0.98rem 0.8rem;
  border-bottom: 1px solid rgba(63, 77, 93, 0.1);
}

.linktray-searchRow__label {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(78, 95, 114, 0.78);
}

.linktray-search {
  width: 100%;
  border: 0;
  outline: 0;
  padding: 0;
  background: transparent;
  color: rgb(28, 40, 54);
  font: inherit;
  font-size: 0.92rem;
}

.linktray-search::placeholder {
  color: rgba(103, 118, 136, 0.78);
}

.linktray-body {
  overflow: auto;
  scrollbar-gutter: stable;
  overscroll-behavior: contain;
}

.linktray-sectionLabel {
  display: block;
  padding: 0.68rem 0.98rem 0.45rem;
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(78, 95, 114, 0.78);
}

.linktray-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.linktray-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  width: 100%;
  padding: 0.76rem 0.98rem;
  border: 0;
  border-top: 1px solid rgba(63, 77, 93, 0.08);
  background: transparent;
  color: rgb(35, 49, 64);
  font: inherit;
  text-align: left;
}

.linktray-summary__label {
  font-size: 0.82rem;
  font-weight: 620;
}

.linktray-summary__meta {
  font-size: 0.74rem;
  color: rgba(78, 95, 114, 0.82);
}

.linktray-summary.linktray-item--selected {
  background: rgba(68, 103, 145, 0.08);
}

.linktray-item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 0.14rem 0.72rem;
  align-items: start;
  padding: 0.78rem 0.98rem;
  border-left: 3px solid transparent;
  transition: background-color 140ms ease, border-color 140ms ease, opacity 140ms ease;
}

.linktray-item + .linktray-item,
.linktray-list + .linktray-sectionLabel,
.linktray-summary + .linktray-sectionLabel,
.linktray-summary + .linktray-list {
  border-top: 1px solid rgba(63, 77, 93, 0.08);
}

.linktray-item__body {
  display: grid;
  gap: 0.12rem;
}

.linktray-item__symbol {
  width: 0.48rem;
  height: 0.48rem;
  margin-top: 0.38rem;
  border-radius: 999px;
}

.linktray-item__symbol--existing {
  background: rgb(88, 168, 132);
  box-shadow: 0 0 0 3px rgba(88, 168, 132, 0.12);
  animation: linktray-status-pulse 2.8s ease-in-out infinite;
}

.linktray-item__symbol--missing {
  border: 1.5px solid rgba(191, 88, 88, 0.72);
  background: rgba(191, 88, 88, 0.14);
}

.linktray-item--selected {
  border-left-color: rgba(53, 101, 164, 0.9);
  background: rgba(68, 103, 145, 0.08);
}

.linktray-item__filename {
  font-size: 0.92rem;
  font-weight: 620;
  letter-spacing: -0.01em;
  color: rgb(20, 31, 43);
}

.linktray-item__path {
  color: rgba(79, 93, 110, 0.92);
  font-size: 0.79rem;
}

.linktray-item--missing {
  opacity: 0.62;
}

.linktray-empty {
  margin: 0;
  padding: 1rem 0.98rem 1.15rem;
  color: rgba(79, 93, 110, 0.9);
  font-size: 0.84rem;
}

@keyframes linktray-status-pulse {
  0%,
  100% {
    box-shadow: 0 0 0 3px rgba(88, 168, 132, 0.1);
    opacity: 0.9;
  }

  50% {
    box-shadow: 0 0 0 5px rgba(88, 168, 132, 0.16);
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .linktray-item__symbol--existing {
    animation: none;
  }
}
`;

type QuickSwitcherCallbacks = {
  onOpen: (path: string) => void | Promise<void>;
  onClose: () => void | Promise<void>;
};

export type QuickSwitcher = {
  readonly selectedIndex: number;
  readonly query: string;
  render(): string;
  handleKey(key: string): void;
  click(index: number): void;
  hover(index: number): void;
  setQuery(query: string): void;
};

type QuickSwitcherAdapterOptions = {
  openFile: (path: string) => Promise<boolean> | boolean;
  document?: Document;
  onShow?: (controller: QuickSwitcher) => void;
};

type QuickSwitcherEntry =
  | {
      type: "item";
      item: PickerItem;
    }
  | {
      type: "missing-summary";
      count: number;
    };

type QuickSwitcherView = {
  availableItems: PickerItem[];
  missingItems: PickerItem[];
  interactiveEntries: QuickSwitcherEntry[];
  showMissingSummary: boolean;
};

const ROOT_ID = "markedit-linktray-root";
const STYLE_SELECTOR = "style[data-linktray-style]";

export function createQuickSwitcher(
  items: PickerItem[],
  callbacks: QuickSwitcherCallbacks
): QuickSwitcher {
  let selectedIndex = 0;
  let query = "";
  let missingExpanded = false;

  return {
    get selectedIndex() {
      return selectedIndex;
    },
    get query() {
      return query;
    },
    render() {
      return renderQuickSwitcherMarkup(
        buildQuickSwitcherView(items, query, missingExpanded),
        selectedIndex,
        query
      );
    },
    handleKey(key) {
      const view = buildQuickSwitcherView(items, query, missingExpanded);
      const interactiveEntries = view.interactiveEntries;

      if (key === "ArrowDown") {
        selectedIndex = Math.min(selectedIndex + 1, interactiveEntries.length - 1);
        return;
      }

      if (key === "ArrowUp") {
        selectedIndex = Math.max(selectedIndex - 1, 0);
        return;
      }

      if (key === "Enter") {
        const entry = interactiveEntries[selectedIndex];

        if (entry?.type === "missing-summary") {
          missingExpanded = !missingExpanded;
          selectedIndex = Math.min(
            selectedIndex,
            buildQuickSwitcherView(items, query, missingExpanded).interactiveEntries.length - 1
          );
          return;
        }

        void maybeOpen(entry?.item, callbacks);
        return;
      }

      if (key === "Escape") {
        void callbacks.onClose();
      }
    },
    click(index) {
      selectedIndex = index;
      const entry = buildQuickSwitcherView(items, query, missingExpanded).interactiveEntries[selectedIndex];

      if (entry?.type === "missing-summary") {
        missingExpanded = !missingExpanded;
        return;
      }

      void maybeOpen(entry?.item, callbacks);
    },
    hover(index) {
      selectedIndex = index;
    },
    setQuery(nextQuery) {
      query = nextQuery;
      selectedIndex = 0;
    }
  };
}

export function createQuickSwitcherAdapter(options: QuickSwitcherAdapterOptions) {
  return async (items: PickerItem[]) => {
    const doc = options.document ?? globalThis.document;

    if (!doc?.body || !doc?.head) {
      return;
    }

    ensureStyles(doc);
    removeExistingRoot(doc);

    const root = doc.createElement("div");
    root.id = ROOT_ID;
    doc.body.append(root);

    let disposed = false;
    let input: HTMLInputElement | null = null;

    const cleanup = () => {
      if (disposed) {
        return;
      }

      disposed = true;
      doc.removeEventListener("keydown", handleDocumentKeyDown, true);
      doc.removeEventListener("keyup", swallowDocumentKeyEvent, true);
      doc.removeEventListener("keypress", swallowDocumentKeyEvent, true);
      root.remove();
    };

    const controller = createQuickSwitcher(items, {
      onOpen: async (path) => {
        await options.openFile(path);
        cleanup();
      },
      onClose: async () => {
        cleanup();
      }
    });

    const render = () => {
      if (disposed) {
        return;
      }

      root.innerHTML = controller.render();
      input = root.querySelector<HTMLInputElement>(".linktray-search");
      bindOverlayEvents(root, controller, render);
      input?.focus();
      input?.setSelectionRange(input.value.length, input.value.length);
    };

    const handleDocumentKeyDown = (event: KeyboardEvent) => {
      if (disposed) {
        return;
      }

      if (!input || doc.activeElement !== input) {
        return;
      }

      if (!isSwitcherKey(event.key)) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      controller.handleKey(event.key);

      if (!disposed && event.key !== "Escape") {
        render();
      }
    };

    const swallowDocumentKeyEvent = (event: KeyboardEvent) => {
      if (disposed) {
        return;
      }

      if (!input || doc.activeElement !== input) {
        return;
      }

      if (!isSwitcherKey(event.key)) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
    };

    doc.addEventListener("keydown", handleDocumentKeyDown, true);
    doc.addEventListener("keyup", swallowDocumentKeyEvent, true);
    doc.addEventListener("keypress", swallowDocumentKeyEvent, true);
    render();
    options.onShow?.(controller);
    return controller;
  };
}

function renderQuickSwitcherMarkup(
  view: QuickSwitcherView,
  selectedIndex: number,
  query: string
): string {
  const rows = view.interactiveEntries.map((entry, index) => {
    if (entry.type === "missing-summary") {
      return [
        `<button class="linktray-summary${index === selectedIndex ? " linktray-item--selected" : ""}" data-index="${index}" type="button">`,
        `<span class="linktray-summary__label">Missing (${entry.count})</span>`,
        '<span class="linktray-summary__meta">Show hidden links</span>',
        "</button>"
      ].join("");
    }

    const item = entry.item;
    const classes = [
      "linktray-item",
      item.status === "missing" ? "linktray-item--missing" : "linktray-item--existing",
      index === selectedIndex ? "linktray-item--selected" : ""
    ].filter(Boolean).join(" ");
    const disabled = item.status === "missing" ? ' aria-disabled="true"' : "";

    return [
      `<li class="${classes}" data-index="${index}"${disabled}>`,
      `<span class="linktray-item__symbol linktray-item__symbol--${item.status}" aria-hidden="true"></span>`,
      '<div class="linktray-item__body">',
      `<span class="linktray-item__filename">${escapeHtml(item.filename)}</span>`,
      `<span class="linktray-item__path">${escapeHtml(item.displayPath)}</span>`,
      "</div>",
      "</li>"
    ].join("");
  });

  const availableRows = rows.slice(0, view.availableItems.length).join("");
  const hasMissingSummary = view.showMissingSummary ? 1 : 0;
  const missingSummaryRow = hasMissingSummary ? rows[view.availableItems.length] ?? "" : "";
  const missingRows = rows.slice(view.availableItems.length + hasMissingSummary).join("");

  return [
    '<section class="linktray-overlay" role="dialog" aria-label="Linked Markdown files">',
    '<div class="linktray-panel">',
    '<header class="linktray-toolbar">',
    '<div class="linktray-toolbar__eyebrow">Index</div>',
    '<div class="linktray-toolbar__headline">',
    '<h2 class="linktray-toolbar__title">Linked Markdown</h2>',
    `<div class="linktray-toolbar__count">${escapeHtml(formatCountLabel(view.availableItems.length, view.missingItems.length, query))}</div>`,
    "</div>",
    "</header>",
    '<div class="linktray-searchRow">',
    '<label class="linktray-searchRow__label" for="linktray-search">Filter</label>',
    `<input id="linktray-search" class="linktray-search" type="text" placeholder="Type a file, path, or status" value="${escapeHtml(query)}" />`,
    "</div>",
    '<div class="linktray-body">',
    view.availableItems.length > 0 ? '<span class="linktray-sectionLabel">Available</span>' : "",
    view.availableItems.length > 0 ? `<ul class="linktray-list">${availableRows}</ul>` : "",
    missingSummaryRow,
    view.missingItems.length > 0 && !view.showMissingSummary
      ? '<span class="linktray-sectionLabel">Missing</span>'
      : "",
    missingRows
      ? `<ul class="linktray-list">${missingRows}</ul>`
      : (!availableRows && !missingSummaryRow ? '<p class="linktray-empty">No linked notes match this filter.</p>' : ""),
    "</div>",
    "</div>",
    "</section>"
  ].join("");
}

async function maybeOpen(item: PickerItem | undefined, callbacks: QuickSwitcherCallbacks) {
  if (!item?.openPath) {
    return;
  }

  await callbacks.onOpen(item.openPath);
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getVisibleItems(items: PickerItem[], query: string): PickerItem[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return items;
  }

  return items.filter((item) => {
    const haystack = `${item.filename}\n${item.displayPath}\n${item.status}`.toLowerCase();
    return haystack.includes(normalizedQuery);
  });
}

function buildQuickSwitcherView(
  items: PickerItem[],
  query: string,
  missingExpanded: boolean
): QuickSwitcherView {
  const availableItems = getVisibleItems(
    items.filter((item) => item.status === "existing"),
    query
  );
  const missingItems = getVisibleItems(
    items.filter((item) => item.status === "missing"),
    query
  );
  const shouldAutoExpandMissing = query.trim().length > 0 && missingItems.length > 0;
  const showMissingSummary = missingItems.length > 0 && !shouldAutoExpandMissing && !missingExpanded;

  return {
    availableItems,
    missingItems,
    showMissingSummary,
    interactiveEntries: [
      ...availableItems.map((item) => ({ type: "item" as const, item })),
      ...(showMissingSummary
        ? [{ type: "missing-summary" as const, count: missingItems.length }]
        : []),
      ...(!showMissingSummary
        ? missingItems.map((item) => ({ type: "item" as const, item }))
        : [])
    ]
  };
}

function bindOverlayEvents(
  root: HTMLDivElement,
  controller: QuickSwitcher,
  rerender: () => void
): void {
  const input = root.querySelector<HTMLInputElement>(".linktray-search");
  const clickableItems = root.querySelectorAll<HTMLElement>("[data-index]");

  input?.addEventListener("input", (event) => {
    controller.setQuery((event.currentTarget as HTMLInputElement).value);
    rerender();
  });

  clickableItems.forEach((item) => {
    item.addEventListener("click", () => {
      const index = Number(item.dataset.index);

      if (!Number.isNaN(index)) {
        controller.click(index);
        rerender();
      }
    });

    item.addEventListener("mouseenter", () => {
      const index = Number(item.dataset.index);

      if (!Number.isNaN(index)) {
        controller.hover(index);
        rerender();
      }
    });
  });
}

function ensureStyles(doc: Document): void {
  if (doc.head.querySelector(STYLE_SELECTOR)) {
    return;
  }

  const styleTag = doc.createElement("style");
  styleTag.dataset.linktrayStyle = "true";
  styleTag.textContent = quickSwitcherCss.trim() || fallbackQuickSwitcherCss;
  doc.head.append(styleTag);
}

function removeExistingRoot(doc: Document): void {
  doc.getElementById(ROOT_ID)?.remove();
}

function isSwitcherKey(key: string): boolean {
  return key === "ArrowDown" || key === "ArrowUp" || key === "Enter" || key === "Escape";
}

function formatCountLabel(activeCount: number, missingCount: number, query: string): string {
  if (query.trim()) {
    return `${activeCount} active · ${missingCount} missing`;
  }

  return `${activeCount} active · ${missingCount} missing`;
}
