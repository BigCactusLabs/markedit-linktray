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
    const normalizedTarget = stripFragment(rawTarget.trim());
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
