import { findRepoRootPath } from "./repo-root";
import { dirname, normalizePath, relative, resolve } from "../support/posix-path";

type ResolveMarkdownTargetInput = {
  currentFilePath: string;
  rawTarget: string;
  kind: "markdown" | "wiki";
};

type ToDisplayPathInput = {
  currentFilePath: string;
  resolvedTargetPath: string;
  repoRootPath: string | null;
};

export { findRepoRootPath };

export function resolveMarkdownTarget({
  currentFilePath,
  rawTarget,
  kind
}: ResolveMarkdownTargetInput): string {
  const currentDirectory = dirname(normalizePath(currentFilePath));
  const normalizedTarget = normalizeTarget(rawTarget, kind);

  return resolve(currentDirectory, normalizedTarget);
}

export function toDisplayPath({
  currentFilePath,
  resolvedTargetPath,
  repoRootPath
}: ToDisplayPathInput): string {
  const normalizedTargetPath = normalizePath(resolvedTargetPath);

  if (repoRootPath) {
    return relative(normalizePath(repoRootPath), normalizedTargetPath);
  }

  return relative(
    dirname(normalizePath(currentFilePath)),
    normalizedTargetPath
  );
}

function normalizeTarget(rawTarget: string, kind: ResolveMarkdownTargetInput["kind"]): string {
  const normalizedTarget = normalizePath(rawTarget.trim());

  if (kind === "wiki" && !normalizedTarget.toLowerCase().endsWith(".md")) {
    return `${normalizedTarget}.md`;
  }

  return normalizedTarget;
}
