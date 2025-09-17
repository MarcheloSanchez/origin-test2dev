# `find_duplicate_titles.js`

## Purpose
- Scan every Markdown file in the vault for a front-matter `title` field.
- Warn when the same title appears in multiple files so duplicates can be consolidated.
- Provide feedback in both Node (console) and Obsidian (via `Notice`).

## Location
- Script path: `99-System/Scripts/find_duplicate_titles.js`
- Vault root inferred from two directories above the script (`../..`).

## Requirements
- Node.js 16 or newer when run from the command line.
- Access to the Obsidian `app.vault` API when executed inside the desktop app (e.g., via the Developer Console or a community plugin runner).

## Inputs & Parameters
- **Command-line arguments:** none. The script intentionally scans the entire vault starting from the repository root.
- **Return value:** resolves to an array of `[title, paths[]]` entries for each duplicated title when used as a module (`require('./find_duplicate_titles')`).
- **Ignored folders:** `.git`, `node_modules`, `.obsidian`, trash folders, and `.DS_Store` are skipped automatically.

## How to Run (Node.js)
1. Open a terminal at the vault root.
2. Execute:
   ```bash
   node 99-System/Scripts/find_duplicate_titles.js
   ```
3. Review the console output:
   - `✅ No duplicate titles found.` when everything is unique.
   - Otherwise, each duplicate title is listed with the Markdown paths that share it. Any read errors are also logged.

## How to Run (Obsidian)
1. Make sure the script is available inside the vault (e.g., via the Obsidian Advanced Scripts or QuickAdd plugins, or by running it through the Developer Console).
2. Execute the script. It uses the Obsidian API to read all Markdown files.
3. Results appear in the developer console and as an in-app `Notice` summarizing how many duplicate titles were found.

## Embedding in Other Scripts
```js
const findDuplicates = require("../Scripts/find_duplicate_titles");

(async () => {
  const duplicates = await findDuplicates();
  if (duplicates.length === 0) return;

  duplicates.forEach(([title, paths]) => {
    console.log(title, paths);
  });
})();
```

## Follow-up Actions
- Consolidate or rename notes that share the same title to avoid confusion in backlinks, searches, and generated content.
- Consider archiving or merging duplicates after manual review.
