
> [!orbit] Wayfinder | [[My PKM MOC]] |  **Master PKM System Overview** |  [[My PKM Queries]] |  [[My PKM Folders]] |  [[My PKM Tags]] |  [[My PKM Workflows - Global Guidelines]] | [[My PKM Tasks]] | 

⬆️:: [[🏡Home]], [[My PKM MOC]]

## 🗺 **Master PKM System Overview**

### **1️⃣ Folders & Purpose**

| 📂 Folder     | 🎯 Purpose                               | 🏷 Key Tags   | 🔄 Main Workflow Stage |
| ------------- | ---------------------------------------- | ------------- | ---------------------- |
| `00 Inbox`    | Capture anything quickly                 | `#📥inbox`    | **Capture**            |
| `01 MOCs`     | Maps of Content for navigation           | `#🗺️MOC`     | **Organize**           |
| `02 Dots`     | Atomic knowledge & ideas                 | `#💡idea`     | **Develop**            |
| `03 Efforts`  | Active projects & long-term initiatives  | `#🚀project`  | **Execute / Track**    |
| `04 Sources`  | Reference material & research            | `#📚source`   | **Reference**          |
| `05 Calendar` | Daily/weekly/monthly notes & reflections | `#📅daily`    | **Reflect**            |
| `06 Archive`  | Completed / inactive items               | `#📦archived` | **Archive**            |
| `99 System`   | Meta-management, templates, scripts      | `#⚙️system`   | **Maintain**           |
### **2️⃣ Core Workflow Pipeline**

**Capture → Process → Organize → Review → Archive**
```
📥 Capture (QuickAdd / Mobile / Voice)
   ↓
🔍 Process (Daily Inbox Review, <2min rule, triage to folder)
   ↓
🏗 Organize (Linking, tagging, MOC updates, metadata fill)
   ↓
📊 Review (Daily priorities, Weekly project review, Monthly cleanup)
   ↓
📦 Archive (Move to 06 Archive, auto-add archived_date)
```

### **3️⃣ Review Cycles**
- **Daily**
    - Process Inbox (10 min)
    - Check Today’s tasks & priorities
    - Log reflections in Daily Note
- **Weekly**
    - Review active Efforts & MOCs
    - Update statuses & archive completed items
    - Clean `#🧹tidy` and `#❔question` notes
- **Monthly**
    - Structural cleanup
    - Adjust folder/tag/metadata rules
    - Backup vault & review plugin list
- **Quarterly**
    - Audit system relevance
    - Optimize templates & queries
---
### **4️⃣ Tag + Metadata Integration**
**Tag categories:**
- **Status:** `#📥inbox` → `#🔄active` → `#✅completed` → `#📦archived`
- **Content type:** `#💡idea` / `#🚀project` / `#📚source` / `#🗺️moc`
- **Note development:** `#🌱develop`, `#❔question`, `#🧹tidy`, `#⚗️experiment`
- **Priority/Energy:** `#priority/high`, `#priority/low`, `#energy/high`, `#energy/low`
- **Context:** `#context/work`, `#context/home`
```
title:
type: atomic|project|source|moc|meeting
status_tag: 📥inbox|🔄active|⏳waiting|✅completed|📦archived
priority: high|medium|low
energy: high|medium|low
maturity: 📤seed|🌱seedling|🪴sapling|🌲evergreen|🍓fruit
created:
modified:
```
### **5️⃣ Plugins & Automation Touchpoints**

|Plugin / Tool|Stage Used|Role|
|---|---|---|
|**QuickAdd**|Capture|Instant note/task templates|
|**Templater**|Capture / Process|Auto-fill metadata, context tags|
|**Tasks**|Organize / Review|Manage GTD-style task lists|
|**Dataview**|Review|Dashboards, reports, queries|
|**Kanban**|Organize / Execute|Visual project tracking|
|**MetaEdit**|Process / Archive|Bulk update metadata|
|**Periodic Notes**|Capture / Review|Daily, Weekly, Monthly notes|
|**Hotkeys/Shortcuts**|All stages|Speed & frictionless flow|
### **6️⃣ Contextual Dashboards**
**Vault Home Dashboard (Dataview)** — pull:
- 📥 **New inbox items** (last 7 days)
- ⏳ **Active Efforts with deadlines**
- 💡 **Recently updated Dots**
- 📚 **Sources to process**
- ✅ **Tasks due today**
### **7️⃣ Maintenance & Evolution**
- **Weekly:** Tidy notes, process questions, update experiments
- **Monthly:** Cleanup unused tags, adjust queries, optimize templates
- **Quarterly:** System audit — what’s slowing you down, what’s unused?
- **Version Control:** Track changes to templates and queries for rollback

# ✅Do/❌Don’t rules
- **Do** keep top-level folders fixed (00–06, 99); **don’t** add new top-levels ad-hoc.
- **Do** route everything through **00-Inbox**; **don’t** create notes directly elsewhere.
- **Do** assign **one** `type` per note; **don’t** mix multiple types.
- **Do** use ISO dates in filenames/fields; **don’t** use other date formats.
- **Do** keep `status` to the enum above; **don’t** encode status with emojis in YAML (use tags if you want visuals).
- **Do** create via templates per folder; **don’t** hand-type frontmatter.
- **Do** store raw content only in 02/03/04/05; **don’t** park raw notes in **01-MOCs** (indexes only).
- **Do** move finished items to **06-Archive** and set `status: archived`; **don’t** leave completed work in active folders.
- **Do** keep names short with “ – ” separators; **don’t** exceed ~60 chars or add noisy prefixes/suffixes.
- **Do** optimize for [DEVICES] (no special path chars; mobile-safe titles); **don’t** rely on plugins unavailable across devices.
- **Do** write in [LANG] and adapt examples to [EXAMPLES] and [PURPOSE]; **don’t** drift from these scopes.