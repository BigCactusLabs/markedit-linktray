// @vitest-environment jsdom

import { describe, expect, it, vi } from "vitest";

import { registerLinkTrayCommand } from "../../src/markedit/command";
import { createQuickSwitcherAdapter, type QuickSwitcher } from "../../src/ui/quick-switcher";

function createFileInfo(filePath: string) {
  return {
    filePath,
    fileSize: 1,
    creationDate: new Date("2026-03-09T00:00:00Z"),
    modificationDate: new Date("2026-03-09T00:00:00Z"),
    parentPath: filePath.split("/").slice(0, -1).join("/") || "/",
    isDirectory: false
  };
}

describe("MarkEdit-linktray integration flow", () => {
  it("groups available links first, collapses missing links by default, and only opens existing targets", async () => {
    let quickSwitcher: QuickSwitcher | undefined;
    const openFile = vi.fn().mockResolvedValue(true);
    const addMainMenuItem = vi.fn();
    const existingPaths = new Set([
      "/workspace/.git",
      "/workspace/docs/specs/alpha.md"
    ]);
    const getFileInfo = vi.fn(async (path?: string) => {
      if (path === undefined) {
        return createFileInfo("/workspace/docs/notes/today.md");
      }

      return existingPaths.has(path) ? createFileInfo(path) : undefined;
    });

    registerLinkTrayCommand(
      {
        addMainMenuItem,
        getFileContent: vi.fn(async () => "Open [[beta]], then [Alpha](../specs/alpha.md), then [[beta]]."),
        getFileInfo,
        showAlert: vi.fn().mockResolvedValue(0),
        openFile
      },
      createQuickSwitcherAdapter({
        document,
        openFile,
        onShow(controller) {
          quickSwitcher = controller;
        }
      })
    );

    await addMainMenuItem.mock.calls[0]?.[0].action();

    expect(quickSwitcher?.render()).toContain("Available");
    expect(quickSwitcher?.render()).toContain("Missing (1)");
    expect(quickSwitcher?.render()).toContain("alpha.md");
    expect(quickSwitcher?.render()).not.toContain("beta.md");

    quickSwitcher?.handleKey("Enter");
    expect(openFile).toHaveBeenCalledWith("/workspace/docs/specs/alpha.md");

    quickSwitcher?.setQuery("beta");
    expect(quickSwitcher?.render()).toContain("beta.md");
  });

  it("keeps the picker open and alerts when MarkEdit cannot open a file", async () => {
    const openFile = vi.fn().mockResolvedValue(false);
    const addMainMenuItem = vi.fn();
    const showAlert = vi.fn().mockResolvedValue(0);

    registerLinkTrayCommand({
      addMainMenuItem,
      getFileContent: vi.fn(async () => "Open [Alpha](../specs/alpha.md)."),
      getFileInfo: vi.fn(async (path?: string) => {
        if (path === undefined) {
          return createFileInfo("/workspace/docs/notes/today.md");
        }

        return path === "/workspace/docs/specs/alpha.md" ? createFileInfo(path) : undefined;
      }),
      showAlert,
      openFile
    });

    await addMainMenuItem.mock.calls[0]?.[0].action();

    const enter = new KeyboardEvent("keydown", {
      key: "Enter",
      bubbles: true,
      cancelable: true
    });

    document.dispatchEvent(enter);
    await Promise.resolve();
    await Promise.resolve();

    expect(openFile).toHaveBeenCalledWith("/workspace/docs/specs/alpha.md");
    expect(showAlert).toHaveBeenCalledWith({
      title: "Could not open linked Markdown file",
      message: "MarkEdit could not open that file. Grant its parent folder access in MarkEdit preferences and try again."
    });
    expect(document.querySelector(".linktray-overlay")).not.toBeNull();
  });
});
