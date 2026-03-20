import { describe, expect, it } from "vitest";

import {
  findRepoRootPath,
  resolveMarkdownTarget,
  toDisplayPath
} from "../../src/resolving/path-resolver";

describe("resolveMarkdownTarget", () => {
  it("resolves relative markdown links from nested directories", () => {
    expect(resolveMarkdownTarget({
      currentFilePath: "/workspace/docs/notes/today.md",
      rawTarget: "../specs/plan.md",
      kind: "markdown"
    })).toBe("/workspace/docs/specs/plan.md");
  });

  it("normalizes wiki links to markdown files", () => {
    expect(resolveMarkdownTarget({
      currentFilePath: "/workspace/docs/notes/today.md",
      rawTarget: "nested/idea",
      kind: "wiki"
    })).toBe("/workspace/docs/notes/nested/idea.md");
  });

  it("strips anchor fragments before resolving", () => {
    expect(resolveMarkdownTarget({
      currentFilePath: "/workspace/docs/notes/today.md",
      rawTarget: "../specs/plan.md#section",
      kind: "markdown"
    })).toBe("/workspace/docs/specs/plan.md");
  });

  it("normalizes path separators before resolving", () => {
    expect(resolveMarkdownTarget({
      currentFilePath: "/workspace/docs/notes/today.md",
      rawTarget: "..\\specs\\plan.md",
      kind: "markdown"
    })).toBe("/workspace/docs/specs/plan.md");
  });
});

describe("findRepoRootPath", () => {
  it("returns the nearest parent that contains a .git marker", () => {
    const existingPaths = new Set([
      "/workspace/.git"
    ]);

    expect(findRepoRootPath("/workspace/docs/notes/today.md", (path) => existingPaths.has(path))).toBe("/workspace");
  });

  it("returns null when no repo root is found", () => {
    expect(findRepoRootPath("/workspace/docs/notes/today.md", () => false)).toBeNull();
  });
});

describe("display path selection", () => {
  it("uses repo-relative display paths when a repo root exists", () => {
    expect(toDisplayPath({
      currentFilePath: "/workspace/docs/notes/today.md",
      resolvedTargetPath: "/workspace/docs/specs/plan.md",
      repoRootPath: "/workspace"
    })).toBe("docs/specs/plan.md");
  });

  it("supports document-relative display paths when no repo root exists", () => {
    expect(toDisplayPath({
      currentFilePath: "/workspace/docs/notes/today.md",
      resolvedTargetPath: "/workspace/docs/specs/plan.md",
      repoRootPath: null
    })).toBe("../specs/plan.md");
  });
});
