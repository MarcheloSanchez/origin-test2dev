# report_stale_notes.js — QuickAdd Protocol

## Purpose
- Surface Markdown notes that have not been modified for a configurable number of days.
- Optionally narrow the scan to a folder subtree and append a follow-up report to a log note.
- Provide immediate feedback inside Obsidian through the console and Notice toasts.

**Script location:** `99-System/Scripts/report_stale_notes.js`

## Requirements
- Obsidian with the **QuickAdd** plugin enabled.
- Add the script via *QuickAdd → Manage Scripts → + User Script* and point it to the file above.

## Parameters (QuickAdd Arguments JSON)
All parameters are optional. Defaults are applied when a key is omitted.

| Key | Type | Default | Notes |
| --- | --- | --- | --- |
| `days` | number | `30` | Age threshold in days. Accepts positive numbers. Aliases: `thresholdDays`, `threshold`. |
| `folder` | string | *(empty)* | Limits the scan to a folder (recursive). Use vault-relative paths such as `02-PARA/Projects`. Leave blank to scan the entire vault. |
| `logNote` | string | *(empty)* | Path to a Markdown note that should receive the appended report. Automatically adds `.md` if missing and creates the file when absent. |
| `openLog` | boolean | `false` | When `true`, opens the log note in the current workspace after writing. Ignored when `logNote` is blank. |

## Typical QuickAdd configurations
### 1. Vault-wide stale note review (console only)
```json
{"days": 45}
```
- Shows a toast and console list when files exceed 45 days since last modification.
- Useful for a periodic review without logging.

### 2. Focus on a single area with a log note
```json
{
  "folder": "02-PARA/Projects",
  "days": 21,
  "logNote": "99-System/Reports/Stale Notes Log",
  "openLog": true
}
```
- Limits scanning to `02-PARA/Projects`.
- Appends a Markdown bullet list summary to `99-System/Reports/Stale Notes Log.md` (auto-created if needed) and opens the log for follow-up triage.

## Output details
- **Console:** grouped, sorted list of stale notes (`oldest → newest`) with age and last modified timestamp.
- **Notice:** success/failure toasts summarizing whether stale notes were found or if the log write failed.
- **Log note (optional):** Markdown section titled `## Report — <ISO timestamp>` with bullet links (`[[wikilinks]]`) to each stale note plus a total count.

## Protocol — running the review
1. Open QuickAdd and trigger the configured choice for `report_stale_notes`.
2. Confirm or edit the JSON arguments if prompted.
3. Review the console output (use *View → Toggle Developer Tools → Console* in Obsidian) or the appended log note.
4. Process each listed note (update, archive, or tag) and rerun the script to confirm it no longer appears once refreshed.

## Troubleshooting & tips
- Ensure the script is saved in the vault and reload QuickAdd if it cannot be located.
- If no notes match the threshold, the script reports success via a green toast and exits without creating log entries.
- For recurring maintenance, schedule a periodic task (weekly/monthly) that runs this QuickAdd choice to keep projects fresh.
