import { describe, expect, it } from "vitest";

import { buildPickerItems } from "../../src/model/picker-item";

describe("buildPickerItems", () => {
  it("maps existing targets into openable picker items", () => {
    expect(buildPickerItems([
      {
        index: 0,
        resolvedPath: "/workspace/docs/specs/plan.md",
        displayPath: "docs/specs/plan.md",
        exists: true
      }
    ])).toEqual([
      {
        status: "existing",
        filename: "plan.md",
        displayPath: "docs/specs/plan.md",
        resolvedPath: "/workspace/docs/specs/plan.md",
        openPath: "/workspace/docs/specs/plan.md"
      }
    ]);
  });

  it("maps missing targets into non-openable picker items", () => {
    expect(buildPickerItems([
      {
        index: 0,
        resolvedPath: "/workspace/docs/specs/missing.md",
        displayPath: "docs/specs/missing.md",
        exists: false
      }
    ])).toEqual([
      {
        status: "missing",
        filename: "missing.md",
        displayPath: "docs/specs/missing.md",
        resolvedPath: "/workspace/docs/specs/missing.md"
      }
    ]);
  });

  it("deduplicates repeated resolved paths", () => {
    expect(buildPickerItems([
      {
        index: 0,
        resolvedPath: "/workspace/docs/specs/plan.md",
        displayPath: "docs/specs/plan.md",
        exists: true
      },
      {
        index: 1,
        resolvedPath: "/workspace/docs/specs/plan.md",
        displayPath: "docs/specs/plan.md",
        exists: true
      }
    ])).toHaveLength(1);
  });

  it("preserves first-seen order across unique targets", () => {
    expect(buildPickerItems([
      {
        index: 1,
        resolvedPath: "/workspace/docs/second.md",
        displayPath: "docs/second.md",
        exists: true
      },
      {
        index: 0,
        resolvedPath: "/workspace/docs/first.md",
        displayPath: "docs/first.md",
        exists: true
      }
    ]).map((item) => item.filename)).toEqual([
      "first.md",
      "second.md"
    ]);
  });
});
