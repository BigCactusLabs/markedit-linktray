# RepoTray

**Every note knows who it links to. Now you can follow.**

RepoTray is a [MarkEdit](https://github.com/MarkEdit-app/MarkEdit) extension that reads the Markdown links in your current note and surfaces them in a keyboard-first quick switcher. One shortcut, every linked file, no hunting through the sidebar.

---

## How It Works

Open a note. Press `Shift+Command+L`. RepoTray scans the document for Markdown links (`[label](path.md)`) and wiki links (`[[note]]`), resolves each target relative to the current file, checks which ones actually exist, and drops them into a filtered list. Green dot means it's there. Red dot means it isn't — yet.

Paths are repo-relative when a `.git` root is discoverable, document-relative otherwise. Available links open on Enter. Missing links stay visible but grayed out — a quiet reminder, not a dead end.

---

## Install

```sh
npm install && npm run build
cp dist/markedit-repotray.js \
   ~/Library/Containers/app.cyan.markedit/Data/Documents/scripts/
```

Restart MarkEdit. The extension appears under **Extensions > Open Linked Markdown**.

---

## Usage

| Key | Action |
|-----|--------|
| `Shift+Command+L` | Open the switcher |
| Type | Filter by filename, path, or status |
| `Arrow Up / Down` | Move through the list |
| `Enter` | Open the selected note |
| `Enter` on **Missing (N)** | Expand or collapse missing links |
| `Escape` | Close |

---

## Folder Access

MarkEdit sandboxes file access. If a linked note won't open, grant its parent folder access in MarkEdit preferences first.

---

## Development

```sh
npm install       # dependencies
npm test          # 30 tests, fast
npm run build     # → dist/markedit-repotray.js
```

---

## Limitations

RepoTray reads links at invocation time — it doesn't live-refresh while you type. Missing files are surfaced but not created. Both are on the list.
