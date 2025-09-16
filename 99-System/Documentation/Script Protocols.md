# Script Protocols

This reference describes how to operate the custom automation scripts bundled with the vault. For each script you will find a short purpose statement, execution instructions, and a breakdown of every argument the script accepts. Use these protocols to wire the scripts into Templater, QuickAdd, or the command line with confidence.

## Active vault scripts (`99-System/Scripts`)

### `Templater_script.js`
- **Purpose**: Injects or replaces YAML/frontmatter and chapter scaffolds using reusable templates for the active note.【F:99-System/Scripts/Templater_script.js†L28-L85】
- **Works with**: Templater user scripts. The file exports helper functions; call them explicitly rather than invoking the module directly.【F:99-System/Scripts/Templater_script.js†L5-L117】
- **Template prerequisites**: Templates live under `Templates/<type>/<type> - 00.Meta.yaml.md` and `Templates/<type>/<type> - 10.Chapters.body.md`. The `type` argument must match these folders.【F:99-System/Scripts/Templater_script.js†L2-L6】

#### Exported helpers
| Function | Required arguments | Optional arguments | Description |
| --- | --- | --- | --- |
| `inject_meta_if_missing(tp, type)` | `tp` – the Templater API object<br>`type` – template folder key | – | Adds the meta template only when the active note lacks frontmatter. Shows a notice describing the result.【F:99-System/Scripts/Templater_script.js†L28-L38】 |
| `add_chapters(tp, type)` | `tp`, `type` | – | Replaces the note body with the chapter template while preserving existing YAML if present.【F:99-System/Scripts/Templater_script.js†L40-L54】 |
| `combine(tp, type, mode="empty")` | `tp`, `type` | `mode` – `"empty"` or `"auto"`; the `auto` mode switches the injected status value to `🔄active`. | Writes both meta and body templates to the active note.【F:99-System/Scripts/Templater_script.js†L56-L70】 |
| `reset_body(tp, type)` | `tp`, `type` | – | Keeps the current YAML and rewrites only the body section from the template.【F:99-System/Scripts/Templater_script.js†L72-L85】 |

**Templater syntax examples**
```templater
<%* await tp.user.Templater_script.inject_meta_if_missing(tp, "02 Project") %>
<%* await tp.user.Templater_script.combine(tp, "03 Effort", "auto") %>
```

### `delete_empty_inbox.js`
- **Purpose**: Deletes empty or "Untitled" notes within a target folder, optionally as a dry run.【F:99-System/Scripts/delete_empty_inbox.js†L2-L49】
- **Works with**: QuickAdd user scripts or Templater JS script execution (pass a `params` object when calling the module).【F:99-System/Scripts/delete_empty_inbox.js†L2-L49】

| Argument | Type | Default | Description |
| --- | --- | --- | --- |
| `folder` | string | `"+"` | Folder (or root note) to scan. Matches paths like `folder/note.md` whose path starts with this prefix.【F:99-System/Scripts/delete_empty_inbox.js†L5-L11】 |
| `dryRun` | boolean | `true` | When true, only logs which files would be deleted and posts an Obsidian notice. Set to `false` to delete.【F:99-System/Scripts/delete_empty_inbox.js†L6-L42】 |

**QuickAdd syntax**
```json
{"folder":"00 Inbox","dryRun":false}
```

**Behaviour**
1. Collects Markdown files inside the requested folder.【F:99-System/Scripts/delete_empty_inbox.js†L9-L31】
2. Marks files for deletion when they are blank or named `Untitled`/`Untitled <n>`.【F:99-System/Scripts/delete_empty_inbox.js†L12-L31】
3. Performs a dry run (default) or deletes the files, and displays a notice with the result.【F:99-System/Scripts/delete_empty_inbox.js†L33-L48】

### `plugin_versions2csv.py`
- **Purpose**: Exports installed plugin versions to a CSV file for audits.【F:99-System/Scripts/plugin_versions2csv.py†L6-L28】
- **Works with**: Python 3 CLI.

| Variable | Description |
| --- | --- |
| `VAULT_PATH` | Absolute path to the vault; update before running.【F:99-System/Scripts/plugin_versions2csv.py†L6-L9】 |
| `plugins_dir` | Derived from `VAULT_PATH/.obsidian/plugins`.【F:99-System/Scripts/plugin_versions2csv.py†L8-L9】 |
| `output_file` | Target CSV file path inside the vault.【F:99-System/Scripts/plugin_versions2csv.py†L8-L9】 |

**Command**
```bash
python 99-System/Scripts/plugin_versions2csv.py
```
The script iterates over each plugin folder, reads `manifest.json`, and writes `Plugin Name, Plugin ID, Version` rows. Errors are printed to stdout.【F:99-System/Scripts/plugin_versions2csv.py†L11-L26】

### `plugin_versions_exportTABLE.py`
- **Purpose**: Produces a Markdown-friendly table of plugin versions.【F:99-System/Scripts/plugin_versions_exportTABLE.py†L5-L29】
- **Works with**: Python 3 CLI.

| Variable | Description |
| --- | --- |
| `VAULT_PATH` | Absolute vault path to inspect.【F:99-System/Scripts/plugin_versions_exportTABLE.py†L5-L8】 |
| `plugins_dir` | Source `.obsidian/plugins` directory built from `VAULT_PATH`.【F:99-System/Scripts/plugin_versions_exportTABLE.py†L7-L21】 |
| `output_file` | Destination text file (defaults to `plugin_versions.txt` inside the vault).【F:99-System/Scripts/plugin_versions_exportTABLE.py†L8-L27】 |

**Command**
```bash
python 99-System/Scripts/plugin_versions_exportTABLE.py
```
Generates a `Plugin Name | ID | Version` table saved to the configured output path.【F:99-System/Scripts/plugin_versions_exportTABLE.py†L10-L29】

### `promptTitle.js`
- **Purpose**: Lightweight YAML re-orderer that moves a predefined key list to the top of the frontmatter.【F:99-System/Scripts/promptTitle.js†L1-L75】
- **Works with**: Templater/QuickAdd user script calls; operates on the active file.【F:99-System/Scripts/promptTitle.js†L7-L75】
- **Arguments**: none.

**Templater syntax**
```templater
<%* await tp.user.promptTitle() %>
```
The script rebuilds the YAML block by ordering the base keys first, then appending any remaining keys alphabetically. It replaces the entire frontmatter/body content in the active file.【F:99-System/Scripts/promptTitle.js†L20-L73】

### `toggle_focus_mode.js`
- **Purpose**: Toggles a distraction-free layout by collapsing sidebars, hiding UI chrome, and enforcing a readable width.【F:99-System/Scripts/toggle_focus_mode.js†L8-L108】
- **Works with**: QuickAdd user scripts or custom command palette scripts (runs in the Obsidian renderer context).【F:99-System/Scripts/toggle_focus_mode.js†L1-L7】【F:99-System/Scripts/toggle_focus_mode.js†L8-L108】

| Argument | Type | Default | Description |
| --- | --- | --- | --- |
| `mode` | string | `"toggle"` | `"on"`, `"off"`, or `"toggle"`. Forces or toggles focus mode.【F:99-System/Scripts/toggle_focus_mode.js†L13-L108】 |
| `sidebars` | string | `"both"` | Which sidebar(s) to collapse (`both`, `left`, `right`, `none`).【F:99-System/Scripts/toggle_focus_mode.js†L14-L64】 |
| `hideUI` | boolean | `true` | Hides ribbons, tab headers, and the status bar while in focus mode.【F:99-System/Scripts/toggle_focus_mode.js†L15-L54】 |
| `readable` | boolean | `true` | Temporarily enables Obsidian’s readable line length. Restored when focus ends.【F:99-System/Scripts/toggle_focus_mode.js†L16-L101】 |
| `width` | number | `820` | Maximum content width (px) applied through injected CSS.【F:99-System/Scripts/toggle_focus_mode.js†L17-L54】 |
| `view` | string | `"keep"` | Switches the current leaf to `"reading"`, `"source"`, or leaves the mode unchanged.【F:99-System/Scripts/toggle_focus_mode.js†L18-L74】 |

**QuickAdd syntax**
```json
{"mode":"on","sidebars":"left","hideUI":false,"width":900}
```

### `yaml_orchestrator.js`
- **Purpose**: Multifunction YAML maintenance engine offering reorder, normalize, and lint modes for one file or many. Includes folder pickers, state persistence, and optional dry-run/backup behaviour.【F:99-System/Scripts/yaml_orchestrator.js†L1-L547】
- **Works with**: Templater user scripts, QuickAdd user scripts, or direct execution via the Obsidian console. Accepts JSON arguments.【F:99-System/Scripts/yaml_orchestrator.js†L16-L37】【F:99-System/Scripts/yaml_orchestrator.js†L362-L547】

#### Common arguments
| Argument | Type | Default | Description |
| --- | --- | --- | --- |
| `mode` | string | `"reorder"` | `"reorder"`, `"normalize"`, or `"lint"` to choose the processing pipeline.【F:99-System/Scripts/yaml_orchestrator.js†L31-L36】 |
| `path` | string | – | Process a specific Markdown file (vault-relative path).【F:99-System/Scripts/yaml_orchestrator.js†L31-L34】 |
| `folder` | string/string[] | – | Process all Markdown files inside the folder(s). Use `"ASK"`/`"ASK*"` to trigger folder pickers.【F:99-System/Scripts/yaml_orchestrator.js†L33-L34】【F:99-System/Scripts/yaml_orchestrator.js†L472-L503】 |
| `askFolder` / `askFolders` | boolean | – | Force the interactive picker for one or multiple folders.【F:99-System/Scripts/yaml_orchestrator.js†L479-L493】 |
| `rememberLast` | boolean | `true` | When using interactive pickers, reuse the last selected folders unless set to `false`.【F:99-System/Scripts/yaml_orchestrator.js†L482-L485】【F:99-System/Scripts/yaml_orchestrator.js†L430-L465】 |
| `forceNew` | boolean | `false` | Skips the “Use last” option in the picker.【F:99-System/Scripts/yaml_orchestrator.js†L434-L485】 |
| `dryRun` | boolean | `false` | Prevents file writes; normalize mode produces preview reports instead.【F:99-System/Scripts/yaml_orchestrator.js†L34-L35】【F:99-System/Scripts/yaml_orchestrator.js†L305-L329】 |
| `backup` | boolean | `true` | When normalizing, saves the original YAML snapshot unless explicitly set to `false`.【F:99-System/Scripts/yaml_orchestrator.js†L35-L36】【F:99-System/Scripts/yaml_orchestrator.js†L277-L303】 |
| `configPath` | string | `99-System/Config/yaml-meta-config.json` | Overrides the metadata configuration file.【F:99-System/Scripts/yaml_orchestrator.js†L35-L110】 |

#### Mode-specific behaviour
- **Reorder**: Preserves existing formatting while rearranging top-level YAML blocks according to the configured order.【F:99-System/Scripts/yaml_orchestrator.js†L112-L164】
- **Normalize**: Parses frontmatter via Obsidian metadata, rewrites values (arrays, enums, dates), optionally snapshots the previous YAML, and overwrites the file. Obeys `dryRun` by emitting preview reports instead of modifying notes.【F:99-System/Scripts/yaml_orchestrator.js†L205-L329】
- **Lint**: Scans notes for schema issues and writes a Markdown report detailing violations.【F:99-System/Scripts/yaml_orchestrator.js†L331-L360】【F:99-System/Scripts/yaml_orchestrator.js†L508-L530】

**Templater syntax**
```templater
<%* await tp.user.yaml_orchestrator({ mode: "normalize", folder: "03-PERIODIC/Daily", dryRun: true }) %>
```

**QuickAdd syntax**
```json
{"mode":"reorder","askFolders":true,"rememberLast":false}
```

### `yaml_reorder.js`
- **Purpose**: Basic YAML re-orderer that rebuilds the frontmatter from simple `key: value` lines.【F:99-System/Scripts/yaml_reorder.js†L1-L123】
- **Works with**: Templater/QuickAdd user script calls on the active file.【F:99-System/Scripts/yaml_reorder.js†L7-L123】
- **Arguments**: none.

**Templater syntax**
```templater
<%* await tp.user.yaml_reorder() %>
```
Rewrites the YAML block so the predefined base keys appear first. Remaining keys are appended alphabetically before restoring the body content.【F:99-System/Scripts/yaml_reorder.js†L22-L120】

### `yaml_reorder_complex.js`
- **Purpose**: Formatting-safe YAML re-orderer that keeps multi-line values, comments, and duplicate keys intact.【F:99-System/Scripts/yaml_reorder_complex.js†L1-L137】
- **Works with**: Templater/QuickAdd user script calls on the active file.【F:99-System/Scripts/yaml_reorder_complex.js†L11-L137】
- **Arguments**: none.

**Templater syntax**
```templater
<%* await tp.user.yaml_reorder_complex() %>
```
Splits the YAML frontmatter into key blocks, rebuilds them according to the base order, and preserves untouched formatting for any unlisted keys or duplicates. Displays an Obsidian notice upon completion.【F:99-System/Scripts/yaml_reorder_complex.js†L60-L137】

## Archived reference scripts (`02-PARA/400-ARCHIVE`)

These scripts remain for comparison or rollback purposes. Treat them as read-only examples because updated versions exist in `99-System/Scripts`.

### `ARCHIVE_Templater_script.js`
- Earlier version of `Templater_script.js` with similar helpers for injecting meta and chapter templates.【F:02-PARA/400-ARCHIVE/ARCHIVE_Templater_script.js†L1-L69】
- Usage mirrors the active script but targets templates without the `.md` suffix in the layout definition.【F:02-PARA/400-ARCHIVE/ARCHIVE_Templater_script.js†L2-L69】

### `archived_yaml_orchestrator.js`
- Legacy build of the YAML orchestrator with the same argument surface as the active version. Retained for historical comparison.【F:02-PARA/400-ARCHIVE/archived_yaml_orchestrator.js†L1-L415】

