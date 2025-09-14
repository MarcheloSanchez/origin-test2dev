---
fileClass: Inbox, Atomic
---
[[🔄active]] 
Love what you’ve got. I’d level it up in four ways:

1. make the **context machine-readable** (inline fields the queries can see),
    
2. add a tiny **Quality Gate / DoD** for each type,
    
3. drop in **self-updating widgets** (backlinks, related, open tasks),
    
4. keep **headings consistent** and short so notes scan fast.

> [!check]- ✅ Quality Gate
> - Success criteria set  
> - At least 1 milestone + 1 next action  
> - Linked to parent MOC or Area  
> - Risk or dependency noted

> [!todo]- 📌 Open Tasks (around this note)
> - je zvláštní, že to ukazuje TODO z těch předchozích 
```dataview
TASK
FROM ""
WHERE !completed AND (contains(file.inlinks, this.file.link) OR contains(file.outlinks, this.file.link))
SORT due ASC
```

[[My PKM Queries#Uncompleted Tasks on current file]]
## Why this helps
- **Inline fields** (`Priority:: …`) are queryable like YAML but live in the body where you think.  
- **Quality Gates** stop half-done notes from polluting dashboards.  
- **Backlinks & tasks widgets** make each note a tiny control panel.  
- **Consistent H2s** keep navigation predictable across types.

- [ ] [[Atomic - AA]] - [[Atomic -]]
- [ ] [[Atomic - uuuu]]