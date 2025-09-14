---
status: 🔄active
tags:
---
> [!orbit] Wayfinder | [[My PKM MOC]] |  [[Master PKM System Overview]] | **My PKM Queries** |  [[My PKM Folders]] |  [[My PKM Tags]] |  [[My PKM Workflows - Global Guidelines]] | [[My PKM Tasks]] | 


⬆️:: [[🏡Home]]
🗺️[[My PKM MOC]]

Zde je místo pro souhrn používaných query. Na toto místo se bude odkazovat pro rychlou referenci / opravy. 

---
# Inline Quieries
## Count All Notes in a Folder

```
`$=dv.pages('"+"').length`
```

## List All Notes in a Folder

```
`$=dv.pages('"+"').file.name`
```

### Meta bind 
```meta-bind
INPUT[progressBar(minValue(0), maxValue(10)):Mood]
```

---
# Daily Workflow Queries
## Evening Review

```dataview-yes
LIST
FROM ""
WHERE contains(file.etags, "#🧹tidy") OR contains(file.etags, "#❔question")
```
## Today's Priorities
```
TASK  
WHERE !completed  
AND (priority = "high" OR due = date(today))  
SORT priority DESC
```
---
## Inbox Processing
```
LIST  
FROM [[📥inbox]]  
WHERE file.ctime >= date(today) - dur(7 days)  
SORT file.ctime DESC
```

```dataviewSS
TABLE WITHOUT ID
  file.link as "Položka",
  dateformat(created, "cccc, d. MMMM") as "Vytvořeno"
FROM "00-Inbox"
WHERE status = "📥inbox"
SORT created ASC
LIMIT 10
```

```dataview-YES
TABLE WITHOUT ID
  file.link AS "📥 K zpracování",
  choice(created, date(created), date(file.ctime)) AS "Zachyceno",
  choice(contains(file.etags, "#🎯priority-high") OR contains(file.etags, "#priority/high"), "🔴", "⚪") AS "Priorita"
FROM ""
WHERE status = "📥inbox" OR contains(file.etags, "#📥inbox")
SORT choice(created, created, file.ctime) ASC
LIMIT 10
```
#  High-priority items napříč složkami
```dataview-YEES
TABLE WITHOUT ID
  file.link AS "Vysoká priorita",
  file.folder AS "Složka",
  choice(
    status = "📥inbox" OR contains(file.etags, "#📥inbox"), "📥",
    choice(status = "🔄active" OR contains(file.etags, "#🔄active"), "🔄",
      choice(status = "⏳waiting" OR contains(file.etags, "#⏳waiting"), "⏳", "📝")
    )
  ) AS "Status"
FROM ""
WHERE contains(file.etags, "#🎯priority-high") OR contains(file.etags, "#priority/high") OR priority = "high"
SORT file.folder, file.name
```
_(Accepts tag or YAML `priority`.)_
## Morning Dashboard
```dataview-data_MISS
TABLE WITHOUT ID
  file.link AS "Dnes na programu",
  choice(
    contains(file.etags, "#🎯priority-high") OR contains(file.etags, "#priority/high"), "🔴 Urgent",
    choice(energy = "high" OR contains(file.etags, "#energy/high"), "⚡ High Energy", "🔋 Low Energy")
  ) AS "Typ"
FROM ""
WHERE ( (status = "📥inbox" OR contains(file.etags, "#📥inbox")) AND (contains(file.etags, "#🎯priority-high") OR contains(file.etags, "#priority/high")) )
   OR ( (status = "🔄active" OR contains(file.etags, "#🔄active")) AND (energy = "high" OR contains(file.etags, "#energy/high")) )
SORT priority DESC
LIMIT 5
```

```dataview-ok
TABLE date(file.mtime) AS Updated, maturity
FROM ""
WHERE (type = "atomic" OR contains(file.etags, "#💡idea"))
SORT file.mtime DESC
LIMIT 10
```

```dataview-datanot
TABLE WITHOUT ID
  file.link AS "Dokončeno dnes",
  choice(
    contains(file.etags, "#🚀project"), "🚀 Projekt",
    choice(contains(file.etags, "#💡idea"), "💡 Myšlenka", "📚 Ostatní")
  ) AS "Typ"
FROM ""
WHERE (status = "✅completed" OR contains(file.etags, "#✅completed"))
  AND choice(modified, modified, file.mtime) >= date(today)
SORT choice(modified, modified, file.mtime) DESC
```
## produktivní dashboard
```
const pages = dv.pages();
const has = (p, t) => (p.file?.etags ?? []).includes(t);

const totalNotes = pages.length;
const inboxCount = pages.where(p => has(p, "#📥inbox") || p.status == "📥inbox")).length;
const activeCount = pages.where(p => has(p, "#🔄active") || p.status == "🔄active")).length;
const completedCount = pages.where(p => has(p, "#✅completed") || p.status == "✅completed")).length;

dv.table(["Metrika", "Hodnota"], [
  ["📝 Celkem poznámek", totalNotes],
  ["📥 K zpracování", inboxCount],
  ["🔄 Aktivní", activeCount],
  ["✅ Dokončené", completedCount],
  ["📊 Processing rate", (inboxCount ? Math.round((activeCount / inboxCount) * 100) : 0) + "%"]
]);
```
(Use `file.etags` and `status` field.)
## Weekly Review Queries
### Completed This Week
```
LIST  
WHERE status = "✅completed"  
AND modified >= date(today) - dur(7 days)  
GROUP BY file.folder
```
---
### Stagnant Projects  
```
TABLE status, modified as "Last Activity"  
FROM "03-Efforts"  
WHERE status = "🔄active"  
AND modified < date(today) - dur(14 days)  
SORT modified ASC
```
---
# Task Queries IN - [[My PKM Tasks]]
---
# Efforts

🟢Select a *Effort [[🔥on]]* below to view
```dataview-OK
List FROM "03-Efforts/On"
where file.name != this.file.name
SORT file.mtime ASC
```
🟠Select a *Effort [[♻️ongoing]]* below to view
```dataview-OK
List FROM "03-Efforts/Ongoing"
where file.name != this.file.name
```
🔴Select a *Effort [[🌊simmering]]* below to view
```dataview-OK
List FROM "03-Efforts/Simmering"
where file.name != this.file.name
```
🔵Select a *Effort [[💤sleeping]]* below to view
```dataview-OK
List FROM "03-Efforts/Sleeping"
where file.name != this.file.name
```
## Active Efforts
```
TABLE status, modified as "Last Update"  
FROM "03-Efforts"  
WHERE status = "🔄active"  
SORT modified DESC
```
## ACTIVE STATUS overview
```dataviewSS
TABLE
status,
maturity,
priority,
date(created) as Created
FROM ""
WHERE status = "🔄active"
SORT priority DESC, created ASC
```
## Stagnující projekty 
```dataview-NOT-TESTED
TABLE project_status, file.mtime as "Last Activity"
FROM "03-Efforts"
WHERE (type = "project" OR project_status = "active")
AND file.mtime < date(today) - dur(14 days)
SORT file.mtime ASC
```
## Active TAG 
```dataview-NOT-TESTED
TABLE tags, file.mtime AS "Last Update"  
FROM "03-Efforts"  
WHERE contains(tags, "🔄active")  
SORT file.mtime DESC
```
---
# Knowledge Queries

## Dots Queries
### Recent Dots by Type
```
TABLE type, created  
FROM "02-Dots"  
WHERE created >= date(today) - dur(30 days)  
GROUP BY type  
SORT created DESC
```
### Time of creation - Dots
``` dataview-
TABLE WITHOUT ID
 file.link as "List from Dots",
 (date(today) - file.cday).day as "Days alive"

FROM "02-Dots"
where file.name != "02 Dots"
SORT file.cday DESC

LIMIT 40
```
### By Type - Dots
```dataview-ye
TABLE type, created  
FROM "02-Dots"  
WHERE created >= date(today) - dur(30 days)  
GROUP BY type  
SORT created DESC
```
### 🏷️ Témata (top clustery)  - Dots
```
TABLE WITHOUT ID topic AS "Téma", length(rows) AS "Počet", rows.file.link AS "Poznámky"
FROM "02-Dots"
WHERE topic
GROUP BY topic
SORT length(rows) DESC
LIMIT 20
```
## 🍃 Maturity (📤 seed → 🍓 fruit) - - Dots
```dataview-OK
TABLE WITHOUT ID maturity AS "Zralost", length(rows) AS "Počet", rows.file.link AS "Link"
FROM "02-Dots"
WHERE maturity
GROUP BY maturity
SORT length(rows) DESC
```
---
## Sources Queries

### Read-these

``` dataview-OK
TABLE WITHOUT ID
 file.link as "List from Sources",
 (date(today) - file.cday).day as "Days alive"

FROM "04-Sources"
where file.name != "04 Sources"
SORT file.cday DESC

LIMIT 40
```

```dataview-ok
LIST FROM "04-Sources"
WHERE type = "source" AND read_status = "to-read" OR contains(tags, "#status/📥inbox")  
SORT priority DESC, created ASC
```

```dataview-ok
LIST  
FROM "04-Sources"  
WHERE  contains(tags, "#status/📥inbox")  
SORT priority DESC, created ASC
```
```
LIST  
FROM "04-Sources"  
WHERE status = "to-read"  
SORT priority DESC, created ASC
```
### ✅ Dokončeno (posledních 30 dní)
```
LIST FROM "04-Sources"
WHERE reading_status = "done" AND file.mtime >= date(today) - dur(30 days)
SORT file.mtime DESC
```

```dataview-HMMM
TABLE WITHOUT ID
  file.link AS "Zdroj",
  source_author AS "Autor",
  choice(read_status = "completed", "✅ Zpracováno", "📖 K přečtení") AS "Stav"
FROM "04-Sources"
WHERE type = "source" OR contains(file.etags, "#📚source")
SORT choice(created, created, file.ctime) DESC
```
---
# Maintenance Queries
##  🆕 Nedávné změny (posledních 14 dní)
> LIMITED TO 10
```dataview-OK
LIST FROM ""
WHERE file.mtime >= date(today) - dur(14 days)
SORT file.mtime DESC
LIMIT 10
```
## Uncompleted Tasks on current file 
```OK
> [!todo]- 📌 Open Tasks (around this note)
```dataview
TASK
FROM ""
WHERE !completed AND (contains(file.inlinks, this.file.link) OR contains(file.outlinks, this.file.link))
SORT due ASC
```
```
```
## Backlinks to current file 
```
```dataviewjs
const here = dv.current();
const uniq = a => [...new Set(a)];
const links = uniq([...(here.file.outlinks??[]), ...(here.file.inlinks??[])].map(x=>x.path));
dv.list(links.map(p=>dv.fileLink(p)));
```
```
```

## **Missing Metadata Query** 
> LIMITED TO 10
```dataview-OK
TABLE WITHOUT ID file.name as "Note", 
!status as "❌ Missing status", 
!type as "❌ Missing type", 
!tags as "❌ Missing tags"
FROM ""
WHERE !status OR !type OR !tags
SORT file.name ASC
LIMIT 10
```
## **Orphan Notes Query:**
> LIMITED TO 10
```dataview-ok
LIST  
FROM ""  
WHERE length(file.inlinks) = 0 AND length(file.outlinks) = 0  
AND !contains(file.path, "Templates")  AND !contains(file.folder, "99-System") AND !contains(file.folder, "06-Archive")
SORT file.name
LIMIT 10
```
## Unresolved links to create next (ranked by how often they’re referenced)

```dataviewjs-OK-long-load
const unresolvedLinksMap = app.metadataCache.unresolvedLinks;
const res = {};
for (let page in unresolvedLinksMap) {
  const unresolved = Object.keys(unresolvedLinksMap[page]);
  if (unresolved.length === 0) continue;
  for (let link of unresolved) {
    if (!res[link]) res[link] = { link, usages: [] };
    res[link].usages.push(dv.fileLink(page));
  }
}
const rows = Object.values(res)
  .map(l => [dv.fileLink(l.link), l.usages.join(' · '), l.usages.length])
  .sort((a, b) => b[2] - a[2]);
dv.table(["Missing Page", "Referenced In", "Count"], rows);
```
---
# Vault-Specific Queries
*Custom dotazy pro tento vault:*
- [ ] Přidat specializované pohledy
- [ ] Definovat specifické filtry
- [ ] Vytvořit dashboard dotazy
```
```
*Poslední aktualizace: `= date(now)`*
---
