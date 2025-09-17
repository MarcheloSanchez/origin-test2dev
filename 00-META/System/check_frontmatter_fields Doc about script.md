# Frontmatter Checker — Script Doc

## Purpose
- Scan every Markdown file in a folder (recursively) and verify that the YAML frontmatter contains the required metadata fields.
- Designed to run both inside Obsidian (shows a `Notice`) and from the command line (prints to stdout/stderr).

## Configuration
- **Required keys** – update `REQUIRED_KEYS` inside `99-System/Scripts/check_frontmatter_fields.js` if the vault’s mandatory fields change. Defaults: `title`, `type`, `status`, `created`.
- **Ignored directories** – the script skips `.git`, `node_modules`, `.obsidian`, and `.github`. Add more in the `IGNORED_DIRECTORIES` set if needed.

## Parameters
| Argument | Type | Default | Description |
| --- | --- | --- | --- |
| `path` (optional) | string | vault root (`../..` relative to the script) | Directory to scan. Provide either an absolute path or a path relative to the current working directory when launching the script. |

## How to run
### From a terminal
```bash
node 99-System/Scripts/check_frontmatter_fields.js
```
- Runs against the vault root.
- Exit code `0` when all files pass; `1` when any file is missing required keys or cannot be read.

To scan a specific folder (e.g., only the PARA notes):
```bash
node 99-System/Scripts/check_frontmatter_fields.js 02-PARA
```

### From Obsidian
- Add the script as a [QuickAdd](https://github.com/chhoumann/quickadd) Macro or run it from the Obsidian developer console.
- When executed inside Obsidian, the results appear as a `Notice` popup and a detailed list in the console.

## Output
- **Summary** – `Notice`/console message indicating how many Markdown files were inspected and how many failed the check.
- **Details** – for each non-compliant note, the console lists either:
  - `missing frontmatter block`, or
  - `missing keys -> <comma-separated list>`
- Files that cannot be read are reported with the error message.

## Workflow tips
1. Run the checker after importing or bulk-editing notes.
2. Fix missing keys directly in the reported files.
3. Re-run until the summary reports that all files contain the required keys.
