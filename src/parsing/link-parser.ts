export type CandidateLink = {
  kind: "markdown" | "wiki";
  original: string;
  rawTarget: string;
  normalizedTarget: string;
  index: number;
};

const MARKDOWN_LINK_RE = /\[([^\]]+)\]\(([^()\s]*(?:\([^()\s]*\)[^()\s]*)*)\)/g;
const WIKI_LINK_RE = /\[\[([^[\]]+)\]\]/g;

export function extractLinkedMarkdownTargets(source: string): CandidateLink[] {
  const scannableSource = maskIgnoredMarkdownRegions(source);
  const links = [
    ...extractMarkdownLinks(source, scannableSource),
    ...extractWikiLinks(scannableSource)
  ];

  return links.sort((left, right) => left.index - right.index);
}

function extractMarkdownLinks(source: string, scannableSource: string): CandidateLink[] {
  return Array.from(scannableSource.matchAll(MARKDOWN_LINK_RE), (match) => {
    const index = match.index ?? 0;

    if (index > 0 && source[index - 1] === "!") {
      return null;
    }

    const original = match[0];
    const rawTarget = match[2];
    const normalizedTarget = stripFragment(rawTarget.trim());

    if (!isMarkdownTarget(normalizedTarget)) {
      return null;
    }

    return {
      kind: "markdown" as const,
      original,
      rawTarget,
      normalizedTarget,
      index
    };
  }).filter((link): link is CandidateLink => link !== null);
}

function extractWikiLinks(scannableSource: string): CandidateLink[] {
  return Array.from(scannableSource.matchAll(WIKI_LINK_RE), (match) => {
    const original = match[0];
    const rawTarget = stripFragment(match[1].split("|", 1)[0].trim());

    if (!rawTarget) {
      return null;
    }

    return {
      kind: "wiki" as const,
      original,
      rawTarget,
      normalizedTarget: normalizeWikiTarget(rawTarget),
      index: match.index ?? 0
    };
  }).filter((link): link is CandidateLink => link !== null);
}

function stripFragment(target: string): string {
  const hashIndex = target.indexOf("#");
  return hashIndex < 0 ? target : target.slice(0, hashIndex);
}

function isMarkdownTarget(target: string): boolean {
  return stripFragment(target).toLowerCase().endsWith(".md");
}

function normalizeWikiTarget(target: string): string {
  const stripped = stripFragment(target);
  return isMarkdownTarget(stripped) ? stripped : `${stripped}.md`;
}

function maskIgnoredMarkdownRegions(source: string): string {
  const maskedSource = source.split("");
  let index = 0;

  while (index < source.length) {
    const fencedCodeBlock = findFencedCodeBlock(source, index);

    if (fencedCodeBlock) {
      maskRange(maskedSource, fencedCodeBlock.start, fencedCodeBlock.end);
      index = fencedCodeBlock.end;
      continue;
    }

    const inlineCodeSpan = findInlineCodeSpan(source, index);

    if (inlineCodeSpan) {
      maskRange(maskedSource, inlineCodeSpan.start, inlineCodeSpan.end);
      index = inlineCodeSpan.end;
      continue;
    }

    index += 1;
  }

  return maskedSource.join("");
}

function findFencedCodeBlock(source: string, start: number): { start: number; end: number } | null {
  const fence = readFence(source, start);

  if (!fence || !hasFenceIndentation(source, start)) {
    return null;
  }

  let cursor = findLineEnd(source, start);

  while (cursor < source.length) {
    const nextLineEnd = findLineEnd(source, cursor);
    const line = source.slice(cursor, nextLineEnd);

    if (isClosingFenceLine(line, fence)) {
      return {
        start,
        end: nextLineEnd
      };
    }

    cursor = nextLineEnd;
  }

  return {
    start,
    end: source.length
  };
}

function findInlineCodeSpan(source: string, start: number): { start: number; end: number } | null {
  if (source[start] !== "`") {
    return null;
  }

  let delimiterEnd = start;

  while (source[delimiterEnd] === "`") {
    delimiterEnd += 1;
  }

  const delimiterLength = delimiterEnd - start;
  let cursor = delimiterEnd;

  while (cursor < source.length) {
    const nextTick = source.indexOf("`", cursor);

    if (nextTick < 0) {
      return null;
    }

    let tickRunEnd = nextTick;

    while (source[tickRunEnd] === "`") {
      tickRunEnd += 1;
    }

    if (tickRunEnd - nextTick === delimiterLength) {
      return {
        start,
        end: tickRunEnd
      };
    }

    cursor = tickRunEnd;
  }

  return null;
}

function readFence(source: string, start: number): string | null {
  const fenceCharacter = source[start];

  if (fenceCharacter !== "`" && fenceCharacter !== "~") {
    return null;
  }

  let fenceEnd = start;

  while (source[fenceEnd] === fenceCharacter) {
    fenceEnd += 1;
  }

  return fenceEnd - start >= 3 ? source.slice(start, fenceEnd) : null;
}

function hasFenceIndentation(source: string, start: number): boolean {
  const lineStart = source.lastIndexOf("\n", start - 1) + 1;
  return /^[ \t]{0,3}$/.test(source.slice(lineStart, start));
}

function isClosingFenceLine(line: string, fence: string): boolean {
  const lineWithoutIndentation = line.replace(/^[ \t]{0,3}/, "");
  const fenceCharacter = fence[0];
  let fenceEnd = 0;

  while (lineWithoutIndentation[fenceEnd] === fenceCharacter) {
    fenceEnd += 1;
  }

  return fenceEnd >= fence.length && /^[ \t\r]*$/.test(lineWithoutIndentation.slice(fenceEnd));
}

function findLineEnd(source: string, start: number): number {
  const lineBreakIndex = source.indexOf("\n", start);
  return lineBreakIndex < 0 ? source.length : lineBreakIndex + 1;
}

function maskRange(maskedSource: string[], start: number, end: number): void {
  for (let index = start; index < end; index += 1) {
    if (maskedSource[index] !== "\n" && maskedSource[index] !== "\r") {
      maskedSource[index] = " ";
    }
  }
}
