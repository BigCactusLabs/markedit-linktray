function splitSegments(path: string): string[] {
  const normalized = normalizePath(path);

  if (normalized === "/") {
    return [];
  }

  return normalized.replace(/^\/+/, "").split("/");
}

export function normalizePath(path: string): string {
  const withForwardSlashes = path.replaceAll("\\", "/");
  const isAbsolute = withForwardSlashes.startsWith("/");
  const nextSegments: string[] = [];

  for (const segment of withForwardSlashes.split("/")) {
    if (!segment || segment === ".") {
      continue;
    }

    if (segment === "..") {
      if (nextSegments.length > 0 && nextSegments[nextSegments.length - 1] !== "..") {
        nextSegments.pop();
        continue;
      }

      if (!isAbsolute) {
        nextSegments.push(segment);
      }

      continue;
    }

    nextSegments.push(segment);
  }

  if (nextSegments.length === 0) {
    return isAbsolute ? "/" : ".";
  }

  return `${isAbsolute ? "/" : ""}${nextSegments.join("/")}`;
}

export function dirname(path: string): string {
  const normalized = normalizePath(path);

  if (normalized === "/" || normalized === ".") {
    return normalized;
  }

  const separatorIndex = normalized.lastIndexOf("/");

  if (separatorIndex < 0) {
    return ".";
  }

  if (separatorIndex === 0) {
    return "/";
  }

  return normalized.slice(0, separatorIndex);
}

export function basename(path: string): string {
  const normalized = normalizePath(path);

  if (normalized === "/" || normalized === ".") {
    return normalized;
  }

  const separatorIndex = normalized.lastIndexOf("/");

  return separatorIndex < 0 ? normalized : normalized.slice(separatorIndex + 1);
}

export function join(...parts: string[]): string {
  return normalizePath(parts.filter(Boolean).join("/"));
}

export function resolve(fromDirectory: string, targetPath: string): string {
  const normalizedTarget = normalizePath(targetPath);

  if (normalizedTarget.startsWith("/")) {
    return normalizedTarget;
  }

  return normalizePath(`${normalizePath(fromDirectory)}/${normalizedTarget}`);
}

export function relative(fromPath: string, toPath: string): string {
  const fromSegments = splitSegments(fromPath);
  const toSegments = splitSegments(toPath);
  let sharedLength = 0;

  while (
    sharedLength < fromSegments.length &&
    sharedLength < toSegments.length &&
    fromSegments[sharedLength] === toSegments[sharedLength]
  ) {
    sharedLength += 1;
  }

  const upSegments = Array.from(
    { length: fromSegments.length - sharedLength },
    () => ".."
  );
  const downSegments = toSegments.slice(sharedLength);
  const output = [...upSegments, ...downSegments].join("/");

  return output || ".";
}
