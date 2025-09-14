# YAML Orchestrator — Quick Doc

## What it does

- **Reorder** → moves **top-level YAML blocks** to your ordered list; preserves formatting & comments.
    
- **Normalize (dry-run)** → writes preview notes; no changes to target files.
    
- **Normalize (apply)** → cleans arrays/dates/status/renames, rewrites YAML, and saves **front-matter snapshots** as MD in `_backups/normalize-snapshots/`.

- **Lint** → (report-only): Scan for issues; writes a Markdown report in `99 System/Reports/…`
    

---

## Safety checklist

- Run **Lint** → fix red flags (non-array tags, bad dates, missing required).
    
- Run **Reorder** (safe) → just layout; zero data changes.
    
- Run **Normalize (dry-run)** → preview notes per file.
    
- Run **Normalize (apply)** → snapshots saved as **.md** under `_backups/normalize-snapshots/…`.
    
- Keep rules in `99 System/Config/yaml-meta-config.json` (single source of truth).
```
<%* await tp.user.yaml_orchestrator({ mode: "lint", folder: "03 Efforts" }) %>
<%* await tp.user.yaml_orchestrator({ mode: "reorder", folder: "03 Efforts" }) %>
<%* await tp.user.yaml_orchestrator({ mode: "normalize", folder: "03 Efforts", dryRun: true, backup: true }) %>
<%* await tp.user.yaml_orchestrator({ mode: "normalize", folder: "03 Efforts", backup: true }) %>
 <!-- apply -->
```
## NEW_updated script - askFolders
```
<%* await tp.user.yaml_orchestrator({ mode: "reorder", askFolders: true }) %>        <!-- pick many -->
<%* await tp.user.yaml_orchestrator({ mode: "normalize", askFolders: true, backup: true }) %>
<%* await tp.user.yaml_orchestrator({ mode: "lint", askFolders: true }) %>

<%* await tp.user.yaml_orchestrator({ mode: "reorder", askFolders: true, forceNew: true }) %>  <!-- ignore last -->
<%* await tp.user.yaml_orchestrator({ mode: "reorder", folder: ["03 Efforts","01 Knowledge"] }) %> <!-- preset list -->
<%* await tp.user.yaml_orchestrator({ mode: "reorder", folder: "ASK" }) %>          <!-- single pick -->

```
## Usage (QuickAdd → User Script → Arguments)
- **Reorder (safe)**: `{"mode":"reorder"}`
- **Normalize (dry-run)**: `{"mode":"normalize","dryRun":true,"backup":true}`
- **Normalize (apply)**: `{"mode":"normalize","backup":true}`
- **Lint (folder)**: `{"mode":"lint","folder":"03 Efforts"}`
## Arguments (what each attribute does)
- `mode`: `"reorder" | "normalize" | "lint"`
- `folder`: run on **all `.md`** in folder (recursive)
- `path`: run on **one file** (overrides active file if set)
- `dryRun` (normalize only): don’t modify; create **Preview** note(s)
- `backup` (normalize only, default **true**): save **YAML snapshot** as `.md`
- `configPath`: custom config file path (default `99 System/Config/yaml-meta-config.json`)
---
## Outputs & where to find them
- **Lint report**: `99 System/Reports/YAML Lint — YYYYMMDD.md`
- **Normalize dry-run preview(s)**: `99 System/Reports/Preview - <NoteName> (<timestamp>).md`
- **Normalize snapshots** (original front-matter only, as MD):  
    `_backups/normalize-snapshots/<path__to__note>.<timestamp>.md`

Config (JSON) — keys that matter
`99 System/Config/yaml-meta-config.json`
```
{
  "order": { "default": ["up","in","x","title","aliases","fileClass","cssclass","type","status","maturity","processing_priority","tags","created","modified","last_review","review_frequency","due","start","end","estimated_effort","completeness","coverage_areas","linked_notes_count","capture_method","related","see_also","related_concepts","related_ideas","role","org","company","email","phone","website","twitter","github","linkedin"] },
  "enums": { "status": ["inbox","active","waiting","completed","archived"] },
  "toArray": ["tags","aliases"],
  "dateKeys": ["created","modified","last_review","review_frequency","due","start","end"],
  "rules": {
    "tags":    { "stripHashes": true, "lowerCase": false, "sort": true,  "dedupe": true, "trim": true },
    "aliases": { "dedupe": true,       "sort": false,      "trim": true },
    "rename":  { "seeAlso": "see_also", "relatedNotes": "related" },
    "ensureRequired": ["title","type","status","created"],
    "removeEmpty": true
  }
}
```
### What each rule does
- **order.default**: desired top-level key order (only moves keys that exist).
- **enums.status**: valid `status` values; common synonyms mapped to canonical.
- **toArray**: keys that must be arrays.
- **dateKeys**: date fields normalized to `YYYY-MM-DD` (auto-fills `created` from file ctime if missing).
- **rules.tags / rules.aliases**: hygiene (strip `#`, trim, dedupe, sort, case).
- **rules.rename**: key migrations (left → right).
- **rules.ensureRequired**: ensure keys exist (empty if missing).
- **rules.removeEmpty**: drop empty strings/arrays post-normalize.
---
## Guarantees & limits (plain talk)
- **Reorder**: preserves comments/formatting; moves whole blocks; duplicates kept (first ordered; extras appended).
- **Normalize**: consistent data & order; **comments lost**; snapshots saved as MD first.
- Only affects **front-matter**; never touches the note body.
- Works on **top-level keys** (nested structures are serialized but not inspected for “rules”).
---
## Suggested batch flow (QuickAdd macros)
1. `{"mode":"lint","folder":"03 Efforts"}`
2. `{"mode":"reorder","folder":"03 Efforts"}`
3. `{"mode":"normalize","folder":"03 Efforts","dryRun":true,"backup":true}`
4. (after review) `{"mode":"normalize","folder":"03 Efforts","backup":true}`


---

# YAML Orchestrator — Button Deck
### Current file
```button
name Reorder YAML (safe)
type command
action QuickAdd: Reorder YAML (safe)
```

```button
name Normalize (dry-run)
type command
action QuickAdd: Normalize YAML (dry-run)
```

```button
name Normalize (apply, snapshot)
type command
action QuickAdd: Normalize YAML (apply)
```
Batch — folder: **03 Efforts**
```button
name Lint – 03-Efforts
type command
action QuickAdd: Lint – 03-Efforts
```

```button
name Reorder – 03 Efforts
type command
action QuickAdd: Reorder – 03 Efforts
```

```button
name Normalize (dry) – 03 Efforts
type command
action QuickAdd: Normalize (dry) – 03 Efforts
```

```button
name Normalize (apply) – 03 Efforts
type command
action QuickAdd: Normalize (apply) – 03 Efforts
```

```button

```