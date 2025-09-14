---
related:
  - "[[Dataview Practicesheet]]"
  - "[[Extensions of files]]"
created: 2025-04-24
tags:
  - 🛜IT
  - 💯cheatsheet
exclude: "true"
---
[[Dataview Practicesheet#Exclude list]]


- **Example Exclusion List**:
    - `Archive/`
    - `Drafts/`
    - `Old Notes/`
    - `Test Notes/`
    - `Low Value Notes/`
    - `Personal Info/`

## list of 
> This covers 
```
Atlas/Notes/Seberozvoj/MeMyselfAndI
Atlas/Archive
Atlas/Utilities
Calendar/Notes/Daily
Calendar/Notes/Daily/Tracker
Atlas/Notes/Finances
```

## tags
-path:Archive

```dataview
TABLE file.link as Note,
FROM ""
WHERE exclude = "true" OR tags IN ("Low Value", "Archived", "Outdated")
SORT file.mtime desc
```

## dataview

```dataview
TABLE file.link as Note,
FROM ""
WHERE exclude = "true"
SORT file.mtime desc
```
