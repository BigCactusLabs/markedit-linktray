// @vitest-environment jsdom

import { describe, expect, it, vi } from "vitest";

import { registerRepoTrayCommand } from "../../src/markedit/command";
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

describe("RepoTray integration flow", () => {
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

    registerRepoTrayCommand(
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
});
