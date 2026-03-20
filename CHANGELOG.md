# Changelog

## 0.1.2 — 2026-03-20

- Fix: links with anchor fragments (`file.md#heading`, `[[note#section]]`) are now recognized instead of silently dropped
- Fix: parentheses in link targets (`release_(v2).md`) no longer break parsing
- Fix: arrow keys no longer corrupt selection state when the filter matches nothing

## 0.1.1 — 2026-03-18

- Hovering a row in the quick switcher now moves the selection highlight

## 0.1.0 — 2026-03-09

First release. MarkEdit-linktray reads Markdown links and wiki links from the active document, resolves them relative to the current file, and presents the results in a keyboard-first quick switcher.

- Parses `[label](path.md)` and `[[wiki]]` link formats
- Resolves paths relative to the current file and shows repo-relative display paths when a `.git` root exists
- Groups available links first, collapses missing links behind a summary row
- Opens existing files on Enter, leaves missing files visible but inactive
- 30 tests covering parsing, resolution, UI, and end-to-end flow
