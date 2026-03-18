import { buildPickerItems, type PickerItem } from "../model/picker-item";
import { extractLinkedMarkdownTargets } from "../parsing/link-parser";
import {
  resolveMarkdownTarget,
  toDisplayPath
} from "../resolving/path-resolver";
import { dirname, join, normalizePath } from "../support/posix-path";
import { createQuickSwitcherAdapter } from "../ui/quick-switcher";

type FileInfo = {
  filePath: string;
};

type MenuItem = {
  title?: string;
  action?: () => void | Promise<void>;
  key?: string;
  modifiers?: ("Shift" | "Control" | "Command" | "Option")[];
};

type Alert = {
  title?: string;
  message?: string;
};

type MarkEditCommandAPI = {
  addMainMenuItem(item: MenuItem | MenuItem[]): void;
  getFileContent(path?: string): Promise<string | undefined>;
  getFileInfo(path?: string): Promise<FileInfo | undefined>;
  showAlert(alert: Alert): Promise<number>;
  openFile?(path: string): Promise<boolean>;
};

type PickerAdapter = (items: PickerItem[]) => void | Promise<void>;

export function registerRepoTrayCommand(
  markedit: MarkEditCommandAPI,
  showPicker: PickerAdapter = createDefaultPickerAdapter(markedit)
): () => Promise<void> {
  const action = async () => {
    const currentFile = await markedit.getFileInfo();

    if (!currentFile?.filePath) {
      await markedit.showAlert({
        title: "RepoTray unavailable",
        message: "Open a saved Markdown file before running RepoTray."
      });
      return;
    }

    const documentText = await markedit.getFileContent();
    const candidateLinks = extractLinkedMarkdownTargets(documentText ?? "");

    if (candidateLinks.length === 0) {
      await markedit.showAlert({
        title: "No linked Markdown files",
        message: "The current document does not contain any Markdown links to show."
      });
      return;
    }

    const repoRootPath = await findRepoRootPath(markedit, currentFile.filePath);
    const pickerItems = await Promise.all(candidateLinks.map(async (link) => {
      const resolvedPath = resolveMarkdownTarget({
        currentFilePath: currentFile.filePath,
        rawTarget: link.rawTarget,
        kind: link.kind
      });
      const fileInfo = await markedit.getFileInfo(resolvedPath);

      return {
        index: link.index,
        resolvedPath,
        displayPath: toDisplayPath({
          currentFilePath: currentFile.filePath,
          resolvedTargetPath: resolvedPath,
          repoRootPath
        }),
        exists: fileInfo !== undefined
      };
    }));

    await showPicker(buildPickerItems(pickerItems));
  };

  markedit.addMainMenuItem({
    title: "Open Linked Markdown",
    key: "L",
    modifiers: ["Command", "Shift"],
    action
  });

  return action;
}

function createDefaultPickerAdapter(markedit: MarkEditCommandAPI): PickerAdapter {
  if (!markedit.openFile) {
    return async () => {};
  }

  return createQuickSwitcherAdapter({
    openFile: (path) => markedit.openFile?.(path) ?? Promise.resolve(false)
  });
}

async function findRepoRootPath(
  markedit: Pick<MarkEditCommandAPI, "getFileInfo">,
  currentFilePath: string
): Promise<string | null> {
  let currentDirectory = dirname(normalizePath(currentFilePath));

  while (true) {
    const gitMarker = await markedit.getFileInfo(join(currentDirectory, ".git"));

    if (gitMarker) {
      return currentDirectory;
    }

    const parentDirectory = dirname(currentDirectory);

    if (parentDirectory === currentDirectory) {
      return null;
    }

    currentDirectory = parentDirectory;
  }
}
