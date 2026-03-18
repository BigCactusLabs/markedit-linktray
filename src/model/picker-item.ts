import { basename } from "../support/posix-path";

export type PickerItemSource = {
  index: number;
  resolvedPath: string;
  displayPath: string;
  exists: boolean;
};

export type PickerItem = {
  status: "existing" | "missing";
  filename: string;
  displayPath: string;
  resolvedPath: string;
  openPath?: string;
};

export function buildPickerItems(sources: PickerItemSource[]): PickerItem[] {
  const seenPaths = new Set<string>();

  return [...sources]
    .sort((left, right) => left.index - right.index)
    .flatMap((source) => {
      if (seenPaths.has(source.resolvedPath)) {
        return [];
      }

      seenPaths.add(source.resolvedPath);

      return [toPickerItem(source)];
    });
}

function toPickerItem(source: PickerItemSource): PickerItem {
  const baseItem = {
    status: source.exists ? "existing" : "missing",
    filename: basename(source.resolvedPath),
    displayPath: source.displayPath,
    resolvedPath: source.resolvedPath
  } satisfies PickerItem;

  if (!source.exists) {
    return baseItem;
  }

  return {
    ...baseItem,
    openPath: source.resolvedPath
  };
}
