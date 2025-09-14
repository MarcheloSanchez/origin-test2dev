---
up: "[[🏡Home]]"
related:
  - "[[My PKM Queries]]"
created: 2025-03-09
tags:
  - 💯cheatsheet
---

⬆️:: [[🏡Home]]

- [ ] Need exclude query 
	- [ ] working on [[Dataview Practicesheet#Exclude list | exclude list ]]

## DATAVIEW

> [!attention] Just copy and write Dataview into the top
> 

### List of prompts

### A. **Přehled Projektů s Úkoly**

- **Cíl**: Zobrazit projekty s počtem nedokončených úkolů.
```
TABLE length(file.tasks) AS "Počet Úkolů"
FROM "Efforts"
WHERE file.tasks
SORT length(file.tasks) DESC
```

### B. **Poznámky s Tagem#work a Statusem "In Progress"**

- **Cíl**: Zobrazit všechny poznámky s tagem `#work` a statusem "In Progress".
```
LIST
FROM [[🤖AI]]  
WHERE status = "🔳🆘✅status/new"
SORT file.mtime DESC
```

### C. **Statistiky Poznámek**

- **Popis**: Zobrazí počet poznámek, úkolů a tagů.
```
TABLE length(rows) AS "Počet"
FROM ""
GROUP BY file.tags
```

### D. **Poznámky s Nejvíce Odkazy**

- **Popis**: Zobrazí seznam 5 poznámek s nejvíce příchozími odkazy.
```
LIST length(file.inlinks)
FROM ""
SORT length(file.inlinks) DESC
LIMIT 5
```

### E. **Poznámky s Nejvíce Tagy**

- **Popis**: Zobrazí seznam 5 poznámek s nejvíce tagy.
```
LIST length(file.tags)
FROM ""
SORT length(file.tags) DESC
LIMIT 5
```

### F. **Poznámky s Nejdelším Textem**

- **Cíl**: Zobrazit 5 poznámek s nejdelším obsahem.
```
LIST file.size
FROM ""
SORT file.size DESC
LIMIT 5
```
### G. **Poznámky s Nejvíce Obrázky**

- **Cíl**: Zobrazit 5 poznámek s nejvíce obrázky.
```
LIST length(file.images)
FROM "+"
SORT length(file.images) asc
LIMIT 5
```

## **3. Pokročilé Atributy**



### A. **Počet Znaků (`file.size`)**

- **Popis**: Počet znaků v poznámce.
```
LIST file.size
FROM ""
SORT file.size DESC
```

### B. **Počet Řádků (`file.lines`)**

- **Popis**: Počet řádků v poznámce.
```
LIST file.lines
FROM ""
SORT file.lines DESC
```

### C. **Počet Úkolů (`file.tasks`)**

- **Popis**: Počet úkolů v poznámce.
```
LIST length(file.tasks)
FROM ""
WHERE file.tasks
```
### D. **Počet Obrázků (`file.images`)**

- **Popis**: Počet obrázků v poznámce. **NOT WORKING**
```
LIST length(file.images)
FROM "Atlas/Utilities/Images"
WHERE file.images
```

# testovac
```code
task
limit 10
```

### Template

```
```dataview
```

## Exclude list 

```
WHERE !contains(file.name, "LQ") AND !contains(file.name, "KANBAN") AND !contains(file.name, "Test") AND !contains(file.name, "OVERVIEW") AND !contains(file.name, "Learn") AND !contains(file.name, "About") AND !contains(file.name, "Template")
```

```
WHERE !contains(file.tags, "#LQ")
```
