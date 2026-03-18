// @vitest-environment jsdom

import { describe, expect, it, vi } from "vitest";

import {
  createQuickSwitcher,
  createQuickSwitcherAdapter
} from "../../src/ui/quick-switcher";

const pickerItems = [
  {
    status: "existing" as const,
    filename: "plan.md",
    displayPath: "docs/specs/plan.md",
    resolvedPath: "/workspace/docs/specs/plan.md",
    openPath: "/workspace/docs/specs/plan.md"
  },
  {
    status: "missing" as const,
    filename: "missing.md",
    displayPath: "docs/specs/missing.md",
    resolvedPath: "/workspace/docs/specs/missing.md"
  }
];

describe("createQuickSwitcher", () => {
  it("renders rows from picker items", () => {
    const switcher = createQuickSwitcher(pickerItems, {
      onOpen: vi.fn(),
      onClose: vi.fn()
    });

    expect(switcher.render()).toContain("Linked Markdown");
    expect(switcher.render()).toContain("1 active");
    expect(switcher.render()).toContain("1 missing");
    expect(switcher.render()).toContain("Available");
    expect(switcher.render()).toContain("Missing (1)");
    expect(switcher.render()).toContain("plan.md");
    expect(switcher.render()).not.toContain("missing.md");
    expect(switcher.render()).toContain("repotray-item__symbol--existing");
  });

  it("supports keyboard navigation", () => {
    const switcher = createQuickSwitcher(pickerItems, {
      onOpen: vi.fn(),
      onClose: vi.fn()
    });

    expect(switcher.selectedIndex).toBe(0);

    switcher.handleKey("ArrowDown");
    expect(switcher.selectedIndex).toBe(1);

    switcher.handleKey("ArrowUp");
    expect(switcher.selectedIndex).toBe(0);
  });

  it("filters rows when the search query changes", () => {
    const switcher = createQuickSwitcher(pickerItems, {
      onOpen: vi.fn(),
      onClose: vi.fn()
    });

    switcher.setQuery("missing");

    expect(switcher.render()).toContain("missing.md");
    expect(switcher.render()).not.toContain("plan.md");
  });

  it("opens existing items when enter is pressed", () => {
    const onOpen = vi.fn();
    const switcher = createQuickSwitcher(pickerItems, {
      onOpen,
      onClose: vi.fn()
    });

    switcher.handleKey("Enter");

    expect(onOpen).toHaveBeenCalledWith("/workspace/docs/specs/plan.md");
  });

  it("renders missing items as disabled and does not open them", () => {
    const onOpen = vi.fn();
    const switcher = createQuickSwitcher(pickerItems, {
      onOpen,
      onClose: vi.fn()
    });

    switcher.handleKey("ArrowDown");
    switcher.handleKey("Enter");
    switcher.handleKey("ArrowDown");
    switcher.handleKey("Enter");

    expect(onOpen).not.toHaveBeenCalled();
    expect(switcher.render()).toContain('aria-disabled="true"');
  });

  it("closes the picker on escape", () => {
    const onClose = vi.fn();
    const switcher = createQuickSwitcher(pickerItems, {
      onOpen: vi.fn(),
      onClose
    });

    switcher.handleKey("Escape");

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("mounts a visible overlay, injects styles, and filters in the adapter", async () => {
    const openFile = vi.fn().mockResolvedValue(true);
    const adapter = createQuickSwitcherAdapter({
      document,
      openFile
    });

    await adapter(pickerItems);

    const overlay = document.querySelector(".repotray-overlay");
    const input = document.querySelector<HTMLInputElement>(".repotray-search");
    const styleTag = document.head.querySelector("style[data-repotray-style]");

    expect(overlay).not.toBeNull();
    expect(input).not.toBeNull();
    expect(input?.readOnly).toBe(false);
    expect(styleTag?.textContent).toContain(".repotray-overlay");

    input!.value = "missing";
    input!.dispatchEvent(new Event("input", { bubbles: true }));

    expect(document.body.textContent).toContain("missing.md");
    expect(document.body.textContent).not.toContain("plan.md");
  });

  it("consumes switcher keyup events so they do not leak through to the editor", async () => {
    const adapter = createQuickSwitcherAdapter({
      document,
      openFile: vi.fn().mockResolvedValue(true)
    });

    await adapter(pickerItems);

    const input = document.querySelector<HTMLInputElement>(".repotray-search");
    input?.focus();

    const event = new KeyboardEvent("keyup", {
      key: "Enter",
      bubbles: true,
      cancelable: true
    });

    document.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
  });
});
