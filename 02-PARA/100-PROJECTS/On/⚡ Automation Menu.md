---
completion_percentage:
deadline:
next_actions:
recurrence:
action_required:
priority:
time_required:
created:
modified:
related:
tags:
  - 🚀project
type:
title:
status:
---
[[🔄active]]

# ⚡ Automation Menu
# Command Center — [DEVICES] → [PURPOSE]

### template 

```button-temp
name <Label>
type command
action <Command Name As In Palette>
```
# Menu
Here’s what the **Menu.md** gives you at a glance:

- **Capture** — One-tap inputs to your system: quick task/idea/meeting forms, “clip URL from clipboard,” and “send to Inbox/Daily” actions (via QuickAdd).
    
- **Create** — Buttons that generate fully-scaffolded notes from templates: Daily, Dot (atomic), Effort (project), Source, Meeting (Templater/QuickAdd).
    
- **Review** — Open your Daily/Weekly review notes, refresh Dataview, surface project boards, and jump to “stale/orphan” clean-ups.
    
- **Utilities** — Handy helpers for any note: insert or re-apply templates, normalize YAML, rebuild MOC indexes, open QuickAdd menu, command palette.
    
- **Admin** — Shortcuts to plugin settings (Templater/QuickAdd), reveal the System folder, toggle reading/editing, and run maintenance scripts.

- [MOC] Home (Start Here Navigation Hub)
- [Folder] 00-Inbox (Quick Capture Dropzone)
- [Folder] 01-MOCs (Maps And Dashboards)
- [Folder] 02-Dots (Atomic Knowledge Notes)
- [Folder] 03-Efforts (Projects And Initiatives)
- [Folder] 04-Sources (References And Materials)
- [Folder] 05-Calendar (Daily Weekly Monthly Logs)
- [Folder] 06-Archive (Completed Cold Storage)
- [Folder] 99-System (Templates Scripts Automation)
- [Folder] 99-System/Templates (Reusable Note Templates)
- [Folder] 99-System/Templater (Scripts And Config)
- [Folder] 99-System/Scripts (Maintenance Dataview Tasks)
- [Template] Daily-Note (ISO Date YAML Autofill)
- [Template] Effort (Project Fields And Status)
- [Macro] QuickAdd — Capture Inbox (Fast Idea Task Capture)
- [Script] Templater — YAML Auto-Fill (Created Modified Author)
## Capture

```button
name New Inbox
type command
action QuickAdd: New Inbox
```

```
name Daily Note
type command
action Periodic notes: Open today's daily note
```

```
name New Idea
type command
action QuickAdd: New Idea
```

```
name New Effort (Template)
type command
action QuickAdd: New Effort 
```

```
name Meeting Note (Template)
type command
action QuickAdd: Meeting Note
```

```
name New Source (Template)
type command
action QuickAdd: New Source 
```

```
name Literature Note
type command
action QuickAdd: Literature Note
```


## Review

```
name Dashboard
type command
action QuickAdd: Weekly Review
```

```
name Tasks – Next
type command
action QuickAdd: Task Inbox → Next
```

```

```

## Utilities

```
name Insert Timestamp
type command
action Templater: Run user script
```

```
name Refresh Dataview
type command
action Dataview: Force refresh views
```

```task-entry
- [ ] {{VALUE:task}} ⏱️ {{VALUE:energy}} @{{VALUE:context}} {{VALUE:priority}}
  ^created:: {{DATE:YYYY-MM-DD}}
```
# new 

### 🔗 Meta Bind tlačítka

```
style: primary
label: 🔄 Obnovit přehledy
action: 
  type: command
  command: "dataview:refresh-views"
```

```
style: secondary  
label: 📝 Nový úkol
action: 
  type: templater
  template: "Templates/Quick Task"
```

```
style: destructive
label: 🚨 Pouze urgentní
action: 
  type: templater
  template: "Templates/Urgent Only View"
```

```
style: primary
label: 📊 Týdenní report
action: 
  type: templater
  template: "Templates/Weekly Review"
```


**Variables (form):**

- `task` (text)
- `energy` (select: low, medium, high)
- `context` (select: work, home, out, deep)
- `priority` (select: ⬜, 🔵, 🟠, 🔴)

# Ideas 
**QuickAdd:** “Promote to Active” → set `status: 🔄active`, stamp `last_reviewed` to today, recompute `next_review`.

QuickAdd: “Snooze Review (+7d)” → add 7 to next_review without changing last_reviewed.

**Templater:** “Review Done” button → update `last_reviewed` = today and `next_review` = `last_reviewed + review_interval`.

