import { describe, expect, it } from "vitest";

import {
  extractLinkedMarkdownTargets,
  type CandidateLink
} from "../../src/parsing/link-parser";

function stripIndices(links: CandidateLink[]) {
  return links.map(({ index, ...link }) => link);
}

describe("extractLinkedMarkdownTargets", () => {
  it("extracts markdown links that point to markdown files", () => {
    expect(stripIndices(extractLinkedMarkdownTargets("[Spec](docs/spec.md)"))).toEqual([
      {
        kind: "markdown",
        original: "[Spec](docs/spec.md)",
        rawTarget: "docs/spec.md",
        normalizedTarget: "docs/spec.md"
      }
    ]);
  });

  it("excludes markdown links that do not point to markdown files", () => {
    expect(extractLinkedMarkdownTargets("[Image](diagram.png)")).toEqual([]);
  });

  it("normalizes wiki links into markdown targets", () => {
    expect(stripIndices(extractLinkedMarkdownTargets("[[note]] and [[nested/path]]"))).toEqual([
      {
        kind: "wiki",
        original: "[[note]]",
        rawTarget: "note",
        normalizedTarget: "note.md"
      },
      {
        kind: "wiki",
        original: "[[nested/path]]",
        rawTarget: "nested/path",
        normalizedTarget: "nested/path.md"
      }
    ]);
  });

  it("extracts markdown and wiki links from mixed prose in source order", () => {
    expect(stripIndices(extractLinkedMarkdownTargets("Open [Alpha](alpha.md), then [[beta]], and skip [site](https://example.com)."))).toEqual([
      {
        kind: "markdown",
        original: "[Alpha](alpha.md)",
        rawTarget: "alpha.md",
        normalizedTarget: "alpha.md"
      },
      {
        kind: "wiki",
        original: "[[beta]]",
        rawTarget: "beta",
        normalizedTarget: "beta.md"
      }
    ]);
  });

  it("strips anchor fragments from markdown links", () => {
    expect(stripIndices(extractLinkedMarkdownTargets("[Setup](INSTALL.md#prerequisites)"))).toEqual([
      {
        kind: "markdown",
        original: "[Setup](INSTALL.md#prerequisites)",
        rawTarget: "INSTALL.md#prerequisites",
        normalizedTarget: "INSTALL.md"
      }
    ]);
  });

  it("strips anchor fragments from wiki links", () => {
    expect(stripIndices(extractLinkedMarkdownTargets("[[note#heading]]"))).toEqual([
      {
        kind: "wiki",
        original: "[[note#heading]]",
        rawTarget: "note",
        normalizedTarget: "note.md"
      }
    ]);
  });

  it("handles parentheses in markdown link targets", () => {
    expect(stripIndices(extractLinkedMarkdownTargets("[doc](release_(v2).md)"))).toEqual([
      {
        kind: "markdown",
        original: "[doc](release_(v2).md)",
        rawTarget: "release_(v2).md",
        normalizedTarget: "release_(v2).md"
      }
    ]);
  });

  it("ignores malformed input safely", () => {
    expect(extractLinkedMarkdownTargets("Broken [link]( and stray [[wiki]")).toEqual([]);
  });
});
