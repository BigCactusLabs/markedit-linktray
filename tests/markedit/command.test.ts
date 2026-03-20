import { describe, expect, it, vi } from "vitest";

import { registerLinkTrayCommand } from "../../src/markedit/command";

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

describe("registerLinkTrayCommand", () => {
  it("registers the command with MarkEdit", () => {
    const { markedit, addMainMenuItem, showPicker } = createMarkEditMock();

    registerLinkTrayCommand(markedit, showPicker);

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

    registerLinkTrayCommand(markedit, showPicker);
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

    registerLinkTrayCommand(markedit, showPicker);
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

  it("deduplicates resolved paths before probing file existence", async () => {
    const { markedit, addMainMenuItem, getFileInfo, showPicker } = createMarkEditMock({
      documentText: "Open [[beta]], then [Beta](beta.md), then [[beta]].",
      existingPaths: ["/workspace/docs/notes/beta.md"]
    });

    registerLinkTrayCommand(markedit, showPicker);
    await addMainMenuItem.mock.calls[0]?.[0].action();

    expect(
      getFileInfo.mock.calls.filter(([path]) => path === "/workspace/docs/notes/beta.md")
    ).toHaveLength(1);
    expect(showPicker).toHaveBeenCalledWith([
      {
        status: "existing",
        filename: "beta.md",
        displayPath: "beta.md",
        resolvedPath: "/workspace/docs/notes/beta.md",
        openPath: "/workspace/docs/notes/beta.md"
      }
    ]);
  });

  it("shows an empty-state alert when no markdown links are found", async () => {
    const { markedit, addMainMenuItem, showAlert, showPicker } = createMarkEditMock({
      documentText: "No repo links here."
    });

    registerLinkTrayCommand(markedit, showPicker);
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

    registerLinkTrayCommand(markedit, showPicker);
    await addMainMenuItem.mock.calls[0]?.[0].action();

    expect(showPicker).not.toHaveBeenCalled();
    expect(showAlert).toHaveBeenCalledWith({
      title: "MarkEdit-linktray unavailable",
      message: "Open a saved Markdown file before running MarkEdit-linktray."
    });
  });
});
