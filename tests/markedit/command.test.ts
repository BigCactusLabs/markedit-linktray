import { describe, expect, it, vi } from "vitest";

import { registerRepoTrayCommand } from "../../src/markedit/command";

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

function createMarkEditMock(options?: {
  currentFilePath?: string | null;
  documentText?: string;
  existingPaths?: string[];
}) {
  const addMainMenuItem = vi.fn();
  const showAlert = vi.fn().mockResolvedValue(0);
  const showPicker = vi.fn();
  const currentFilePath = options?.currentFilePath === undefined
    ? "/workspace/docs/notes/today.md"
    : options.currentFilePath;
  const existingPaths = new Set(options?.existingPaths ?? []);

  const getFileInfo = vi.fn(async (path?: string) => {
    if (path === undefined) {
      return currentFilePath ? createFileInfo(currentFilePath) : undefined;
    }

    return existingPaths.has(path) ? createFileInfo(path) : undefined;
  });

  const getFileContent = vi.fn(async () => options?.documentText);

  return {
    markedit: {
      addMainMenuItem,
      getFileContent,
      getFileInfo,
      showAlert
    },
    addMainMenuItem,
    getFileContent,
    getFileInfo,
    showAlert,
    showPicker
  };
}

describe("registerRepoTrayCommand", () => {
  it("registers the command with MarkEdit", () => {
    const { markedit, addMainMenuItem, showPicker } = createMarkEditMock();

    registerRepoTrayCommand(markedit, showPicker);

    expect(addMainMenuItem).toHaveBeenCalledTimes(1);
    expect(addMainMenuItem.mock.calls[0]?.[0]).toMatchObject({
      title: "Open Linked Markdown",
      key: "L",
      modifiers: ["Command", "Shift"]
    });
    expect(addMainMenuItem.mock.calls[0]?.[0].action).toBeTypeOf("function");
  });

  it("snapshots the current document and passes picker rows to the ui adapter", async () => {
    const { markedit, addMainMenuItem, getFileContent, getFileInfo, showPicker } = createMarkEditMock({
      documentText: "Open [Plan](../specs/plan.md)",
      existingPaths: ["/workspace/docs/specs/plan.md"]
    });

    registerRepoTrayCommand(markedit, showPicker);
    await addMainMenuItem.mock.calls[0]?.[0].action();

    expect(getFileInfo).toHaveBeenCalledWith();
    expect(getFileContent).toHaveBeenCalledWith();
    expect(showPicker).toHaveBeenCalledWith([
      {
        status: "existing",
        filename: "plan.md",
        displayPath: "../specs/plan.md",
        resolvedPath: "/workspace/docs/specs/plan.md",
        openPath: "/workspace/docs/specs/plan.md"
      }
    ]);
  });

  it("uses repo-relative display paths when a repo root is discoverable", async () => {
    const { markedit, addMainMenuItem, showPicker } = createMarkEditMock({
      documentText: "Open [Plan](../specs/plan.md)",
      existingPaths: [
        "/workspace/.git",
        "/workspace/docs/specs/plan.md"
      ]
    });

    registerRepoTrayCommand(markedit, showPicker);
    await addMainMenuItem.mock.calls[0]?.[0].action();

    expect(showPicker).toHaveBeenCalledWith([
      {
        status: "existing",
        filename: "plan.md",
        displayPath: "docs/specs/plan.md",
        resolvedPath: "/workspace/docs/specs/plan.md",
        openPath: "/workspace/docs/specs/plan.md"
      }
    ]);
  });

  it("shows an empty-state alert when no markdown links are found", async () => {
    const { markedit, addMainMenuItem, showAlert, showPicker } = createMarkEditMock({
      documentText: "No repo links here."
    });

    registerRepoTrayCommand(markedit, showPicker);
    await addMainMenuItem.mock.calls[0]?.[0].action();

    expect(showPicker).not.toHaveBeenCalled();
    expect(showAlert).toHaveBeenCalledWith({
      title: "No linked Markdown files",
      message: "The current document does not contain any Markdown links to show."
    });
  });

  it("shows an alert when there is no active file path", async () => {
    const { markedit, addMainMenuItem, showAlert, showPicker } = createMarkEditMock({
      currentFilePath: null,
      documentText: "Open [Plan](../specs/plan.md)"
    });

    registerRepoTrayCommand(markedit, showPicker);
    await addMainMenuItem.mock.calls[0]?.[0].action();

    expect(showPicker).not.toHaveBeenCalled();
    expect(showAlert).toHaveBeenCalledWith({
      title: "RepoTray unavailable",
      message: "Open a saved Markdown file before running RepoTray."
    });
  });
});
