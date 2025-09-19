# normalize_tags QuickAdd Script

## Purpose
The `normalize_tags.js` script standardizes the frontmatter `tags` array for every Markdown file in the vault. It lowercases tag values, sorts them, removes duplicates, and preserves wiki-link style wrappers like `[[tag]]`.

## Requirements
- Obsidian desktop (the script relies on the `window.app` API).
- The [QuickAdd](https://github.com/chhoumann/quickadd) plugin with a macro or script choice configured to run JavaScript files.
- The script saved at `99-System/Scripts/normalize_tags.js` inside the vault.

## Parameters
- **Input:** The script does not accept runtime parameters. QuickAdd executes the exported async function without arguments.
- **Environment:** Requires access to `app.vault` and `app.metadataCache`, which are supplied automatically when the script is executed inside Obsidian.
- **Output:** Logs progress and completion messages to the developer console (⌘/Ctrl+Shift+I → Console).

## Setup in QuickAdd
1. Install and enable QuickAdd if it is not already active.
2. Open **QuickAdd → Manage Macros** (or **Manage Choices** for a *Script Choice*).
3. Add a new **Macro** (recommended) and include a **Run JavaScript** step that points to `99-System/Scripts/normalize_tags.js`.
   - Alternatively, add a new **Script Choice** and browse to the same file.
4. Give the macro/choice a descriptive name such as `Normalize tags` and optionally assign a hotkey or add it to the Command Palette via QuickAdd settings.

## Running the Script
1. Trigger the QuickAdd macro/choice (Command Palette, assigned hotkey, or QuickAdd modal).
2. Obsidian iterates over every Markdown file returned by `app.vault.getMarkdownFiles()`.
3. For each file with frontmatter `tags`, QuickAdd:
   - Parses nested structures and comma-separated strings.
   - Lowercases tag values and preserves wiki-link wrappers.
   - Sorts and deduplicates the normalized tags.
   - Writes the cleaned list back through `app.fileManager.processFrontMatter`.
4. Watch the developer console for messages indicating which notes were updated and a final completion summary.

## Verification Steps
- Open a few sample notes after the run and confirm their frontmatter `tags` are lowercased, alphabetically sorted, and de-duplicated.
- If a note’s tags were already normalized, it will be skipped silently (no console log entry).

## Troubleshooting
- **"Obsidian app context unavailable"**: Ensure the script is run inside Obsidian; it cannot be executed from the command line.
- **No tags updated**: Confirm the target notes store tags in frontmatter (not inline) and that the `tags` key exists.
- **Undo changes**: Use Obsidian’s File Recovery plugin or version control to revert if needed.
