---
title: 99-System
type: "[[Maps]]"
status: 🔄active
in: "[[Maps]]"
up: "[[🏡Home]]"
tags:
  - 🗺️MOC
created: 2025-09-10
modified: 2025-09-10
related:
capture_method: manual
completeness: comprehensive
coverage_areas:
estimated_effort:
fileClass: MOC
last_review: 2025-09-10
processing_priority: normal
review_frequency: weekly
---


⬆️:: [[🏡Home]]

*Poslední aktualizace: `= date(now)`*

>The **Systems** folder is a place for technical notes, code snippets, automation scripts, and integration documentation. It might include configuration files, documentation for your productivity setups, or instructions for how different tools in your “second brain” connect (for example, how you integrate Obsidian with other apps, or scripts that periodically backup or format notes). By isolating these in a Systems folder, you acknowledge they support your knowledge system but are not themselves part of your knowledge content.

# Features
Hotkeys & zkratky — [[Hotkeys & Automation]], [[Visual hotkeys]]

Šablony & Templater — vstup na systém šablon / skriptů

Standardy & konvence — [[Guidelines]], [[Naming convention Handbook]], [[Icon pack]]

Metadata schema — [[My PKM Metadata]] (univerzální pole, maturity)

Dashboards & Queries — [[My PKM Queries]] (centrální katalog dotazů)

Údržba & audit — kontrola odkazů, archivace, health-check skripty

# ⚙️ 99 System — Overview???

## 🧩 Templates & Templater
[[TemplateR]], [[Templates]]
- Auto‑fill YAML, context tagging, maturity rules

## 📊 Dashboards & Queries
- Global dashboards note
- [[My PKM Queries]]

## 🧰 Scripts & Automations
- QuickAdd capture flows
- MetaEdit bulk updates

## 🧼 Maintenance
- [[💾Changelog]] • [[💾Backlog]]
- Plugin list sync & updates



# Queries
```dataview
TABLE file.name as "Script", modified as "Last Modified"
FROM "99-System/Templates/"
WHERE contains(file.title,"Templates%%")
SORT modified DESC
```

Below are all notes(50) in System that where recently modified
```dataview
List FROM "99-System"
where file.name != this.file.name
SORT file.mtime DESC
LIMIT 50

```