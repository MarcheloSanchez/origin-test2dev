> [!orbit] Wayfinder | [[My PKM MOC]] |  [[Master PKM System Overview]] |  [[My PKM Queries]] |  [[My PKM Folders]] |  [[My PKM Tags]] |  [[My PKM Workflows - Global Guidelines]] | **My PKM Tasks**

⬆️:: [[🏡Home]]
🗺️[[My PKM MOC]]
# INTRO

1. **Kanban ≈ roadmap** → gives you strategic focus at a glance.
    
2. **Master TODO ≈ queue** → one place to triage and pull next actions.
    
3. **Daily Note ≈ inbox** → stay fast; clear it nightly so clutter never builds.

# 1. Architektura UNIFIED Task Management Systému

**Core Task Engine:**
- **Tasks plugin** - základní engine pro vytváření, sledování a dotazování úkolů [2](https://github.com/obsidian-tasks-group/obsidian-tasks)[5](https://www.wundertech.net/obsidian-tasks/)
- **Kanban plugin** - vizuální workflow management a project tracking 1[6](https://forum.obsidian.md/t/kanban-plugin-video-tutorial/17444)
**Supporting Tools:**
- **QuickAdd** - rychlé zachycení úkolů a automatizace workflow 7
- **Templater** - automatické šablony pro konzistentní task creation
- **Dataview** - pokročilé reportování a analytics úkolů
**Optional Integrations:**
- **Todoist Sync** - externí synchronizace pro mobilní přístup [8](https://www.reddit.com/r/ObsidianMD/comments/1ankmxj/which_task_manager_integrates_best_with_obsidian/)[9](https://eightify.app/media/setting-up-a-task-management-system-with-obsidian-and-a-step)
- **Morgen Tasks** - kalendářní integrace a time blocking [10](https://obsidian-plugin-stats.vercel.app/plugins/morgen-tasks)
## 1.1 Mapping na PKM strukturu
```
00-Inbox    → Quick capture (QuickAdd + Tasks)
02-Dots     → Idea tasks (lightweight checkboxes)
03-Efforts  → Project Kanban boards + Tasks queries
04-Sources  → Reference tasks (research, reading)
05-Calendar → Daily/weekly task dashboards
06-Archive  → Completed tasks (automated archival)
99-System   → Task templates and automation scripts
```
## 1.2 Klíčové symboly:
- 📅 Due date (termín dokončení)
- ⏰ Scheduled date (naplánovaný čas)
- 🛫 Start date (datum začátku)
- ✅ Done date (automaticky při dokončení)
- 🔁 Recurrence (opakování)
- ⏫⏬ Priority (vysoká/nízká)
- 🆔 Task ID (pro sledování)
## 1.3 Best practices pro Kanban workflow

**Strukturování boardů podle typu projektu:**
- **Development projects:** Backlog → Development → Testing → Deploy → Done
- **Content creation:** Ideas → Research → Writing → Review → Published
- **Administrative:** Inbox → Planning → Action → Waiting → Completed
---
## 2. Pokročilé dotazy pro váš workflow
## Dnešní úkoly
```TASKS-QUERY
not done  
due today  
sort by priority, due
```
## Přehled projektů
```
not done
path includes 03 Efforts
group by filename
sort by priority DESC
sort by due
```
## Deadline check 
```dataview-
TASK
WHERE !completed AND deadline
SORT deadline ASC
```
## Čekající úkoly (GTD)
```
not done  
description includes waiting
```

```
LIST
FROM ""
WHERE contains(file.etags, "#🧹tidy") OR contains(file.etags, "#❔question")
```

```dataview-query
TABLE started, file.folder AS Path, file.etags AS "File Tags" 
FROM [[games]] 
```

```
done this week  
group by done
```

```
not done  
due before next week
```

```
not done  
(due today) OR (scheduled today)  
sort by priority, due  
limit 5
```

```
TASK
WHERE !completed
GROUP BY file.folder
SORT priority DESC
```

```
TASK
FROM ""
WHERE !completed 
AND due = date(today)
AND contains(tags, "#úkol") ???
SORT priority desc, due asc
```

```
TABLE 
  text as "Úkol",
  due as "Termín",
  priority as "Priorita",
  choice(due < date(today), "🔴 Po termínu", 
         due = date(today), "🟡 Dnes", 
         due = date(today) + dur(1 day), "🟠 Zítra",
         "🔵 Nadcházející") as "Stav"
FROM ""
WHERE !completed AND due <= date(today) + dur(7 days)
SORT due asc, priority desc
```
---