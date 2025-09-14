---
title: 02-Dots
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

Aliasess:: Atlas 

⬆️:: [[🏡Home]]
[[+ About Dotsℹ️]]
[[Dot Template|Click here for template]]
[[Dot Metadata|Click here for metadata]]
[[_Dots_Data.base|Click here for showcase data]] AKA show "All Ideas”
# 💡 02 Dots — Overview
[[Concepts]]
[[Ideas]]
[[330-PEOPLE]]
[[Tools]]
[[Quotes]]
[[Statements]]
[[Things]]

## 🌱 Maturity distribution
```dataview
TABLE maturity, length(rows) AS count
FROM "02-Dots"
WHERE type = "atomic"
GROUP BY maturity
SORT count DESC
```

## 🆕 Recent Dots (30 days)
```dataview
TABLE created, maturity
FROM "02-Dots"
WHERE created >= date(today) - dur(30 days)
SORT created DESC
```

## 🔗 Dots needing links (manual)
> Open random Dots and add 1–2 connections.

## 🧪 Working list
- [[🌱develop]] • [[❔question]] • [[🧹tidy]] • [[⚗️experiment]]

Below are all notes(50) in Dots that where recently modified
```dataview
List FROM "02-Dots"
where file.name != this.file.name
SORT file.mtime DESC
LIMIT 50
```
---
# Features
Témata & domény — tematické indexy (např. Communication, Body Language)
**Stupeň zralosti (maturity)** — sekce: 📤 seed → 🍓 fruit (Dataview výběry)
Související projekty — „Použito v“ → odkazy na [[Efforts Hub (Projects)]]
Zdrojová stopa — „Podpořeno z“ → odkazy na [[Sources Library]]
Kurátorské listy — „Best of“/„Evergreen“ kolekce
Poznámky k práci s pojmy — odkaz na standardy metadat/taxonomií [[My PKM Metadata]]