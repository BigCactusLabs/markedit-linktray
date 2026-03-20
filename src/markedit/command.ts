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

export function registerLinkTrayCommand(
  markedit: MarkEditCommandAPI,
  showPicker: PickerAdapter = createDefaultPickerAdapter(markedit)
): () => Promise<void> {
  const action = async () => {
    const currentFile = await markedit.getFileInfo();

    if (!currentFile?.filePath) {
      await markedit.showAlert({
        title: "MarkEdit-linktray unavailable",
        message: "Open a saved Markdown file before running MarkEdit-linktray."
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
    const seenResolvedPaths = new Set<string>();
    const uniqueTargets = candidateLinks.flatMap((link) => {
      const resolvedPath = resolveMarkdownTarget({
        currentFilePath: currentFile.filePath,
        rawTarget: link.rawTarget,
        kind: link.kind
      });

      if (seenResolvedPaths.has(resolvedPath)) {
        return [];
      }

      seenResolvedPaths.add(resolvedPath);

      return [{
        index: link.index,
        resolvedPath
      }];
    });
    const pickerItems = await Promise.all(uniqueTargets.map(async (target) => {
      const fileInfo = await markedit.getFileInfo(target.resolvedPath);

      return {
        index: target.index,
        resolvedPath: target.resolvedPath,
        displayPath: toDisplayPath({
          currentFilePath: currentFile.filePath,
          resolvedTargetPath: target.resolvedPath,
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
    openFile: (path) => markedit.openFile?.(path) ?? Promise.resolve(false),
    onOpenFailure: async () => {
      await markedit.showAlert({
        title: "Could not open linked Markdown file",
        message: "MarkEdit could not open that file. Grant its parent folder access in MarkEdit preferences and try again."
      });
    }
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
