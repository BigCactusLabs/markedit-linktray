import { dirname, join, normalizePath } from "../support/posix-path";

export function findRepoRootPath(
  currentFilePath: string,
  pathExists: (candidatePath: string) => boolean
): string | null {
  let currentDirectory = dirname(normalizePath(currentFilePath));

  while (true) {
    if (pathExists(join(currentDirectory, ".git"))) {
      return currentDirectory;
    }

    const parentDirectory = dirname(currentDirectory);

    if (parentDirectory === currentDirectory) {
      return null;
    }

    currentDirectory = parentDirectory;
  }
}
