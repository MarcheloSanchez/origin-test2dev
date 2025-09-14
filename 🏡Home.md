---
title: Home
fileClass: MOC
type: MOC
status: 🔄active
processing_priority: urgent
tags: 
created: 2025-09-10
modified: 2025-09-10
last_review: 2025-09-10
review_frequency: weekly
completeness: comprehensive
coverage_areas: 
capture_method: manual
related: 
---

⬆️::[[▶️ START HERE]]
[[+About]]
## MOCs
---
- [[00-Inbox]] - Incoming notes
- [[01-MOCs]] - Maps of Contents 
- [[Dots]] - Categorized notes
- [[Efforts]] - Overview of projects
- [[Sources]] - Overview of sources
- [[03-PERIODIC]] - Overview of daily notes and other journalling 
- [[06-Archive]] - Overview of archived notes
- [[99-System]]

---
## Rychlý přístup
[[🏡House Tour]]
[[Dashboard]]
🗺️[[My PKM MOC]]
📝[[Templates]] - [[TemplateR]]
[[Performance Metrics]]
[[Visual hotkeys]]
[[Icon pack]]
## 🧭 Quick Access 
- [[00-Inbox]] - Nezpracované (📥) 
- [[Dots]] - Atomické znalosti (💡) 
- [[Efforts]] - Aktivní projekty (🚀) 
- [[03-PERIODIC]] - Časové záznamy (📅)
- 🚀[[Hotkeys Quick Reference]] - Zkratky
- 📖[[My PKM Workflows - Global Guidelines]]
- [[My PKM Queries]]
- [[KANBAN PKM TEST]] - [[Kanban Process - Without settings]]
## 🔄Often used 
- 🚀[[Google search CHEATSHEET]]
- 📊[[Performance Metrics]]
- 📖[[Nick Milo's Custom Callouts]]
- 📖[[Debug Guide]]
## Favorites ( ❤️ or ⭐)
```dataview
LIST
FROM [[⭐]] or  [[❤️]]
SORT file.mtime DESC
```
## Quick Notes
```dataviewjs
const notes = dv.pages('"00-Inbox"')
if (notes.length){
  dv.list(notes.file.link)
}
else{
  dv.span('- ? Not any Quick Notes Found')
}
```
## Recents

### Last Opened
```dataviewjs
dv.list(app.workspace.recentFileTracker.lastOpenFiles.map(x=>dv.fileLink(x)).slice(0, 10))
```
---
### Last Modified
```dataview
LIST
FROM ""
SORT file.mtime DESC
LIMIT 7
```