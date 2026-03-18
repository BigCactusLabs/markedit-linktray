export type CandidateLink = {
  kind: "markdown" | "wiki";
  original: string;
  rawTarget: string;
  normalizedTarget: string;
  index: number;
};

const MARKDOWN_LINK_RE = /\[([^\]]+)\]\(([^)\s]+)\)/g;
const WIKI_LINK_RE = /\[\[([^[\]]+)\]\]/g;

export function extractLinkedMarkdownTargets(source: string): CandidateLink[] {
  const links = [
    ...extractMarkdownLinks(source),
    ...extractWikiLinks(source)
  ];

  return links.sort((left, right) => left.index - right.index);
}

function extractMarkdownLinks(source: string): CandidateLink[] {
  return Array.from(source.matchAll(MARKDOWN_LINK_RE), (match) => {
    const original = match[0];
    const rawTarget = match[2];
    const normalizedTarget = rawTarget.trim();
    const index = match.index ?? 0;

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

function extractWikiLinks(source: string): CandidateLink[] {
  return Array.from(source.matchAll(WIKI_LINK_RE), (match) => {
    const original = match[0];
    const rawTarget = match[1].split("|", 1)[0].trim();

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

function isMarkdownTarget(target: string): boolean {
  return target.toLowerCase().endsWith(".md");
}

function normalizeWikiTarget(target: string): string {
  return isMarkdownTarget(target) ? target : `${target}.md`;
}
