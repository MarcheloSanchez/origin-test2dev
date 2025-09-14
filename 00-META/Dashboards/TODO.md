⬆️:: [[🏡Home]]

This is a place to view every checkbox in vault 
- [ ] Add table of content or how to search in this 
- [ ] Link to [[My PKM Tasks]]



## dataview vs TASKS

### Dataview in System
- WITHOUT count
```dataview
TASK
FROM "99-System"
LIMIT 10
```
### Multiple tags
```dataview
TASK
FROM [[🌱develop]]  OR [[💡idea]] 
LIMIT 10
```
### List only open tasks
```dataview
TASK
FROM "99-System"
WHERE !completed
limit 10
```

### Group tasks by file

```dataview
TASK
FROM "99-System"
GROUP BY file.link
LIMIT 5
```

### Show tasks that have a certain tag

```dataview-NOT-WORKING
TASK
FROM "99-System"
WHERE contains(tags, "#cz")
```
### Combine multiple folders 
- replace with real folders here
```dataview
TASK
FROM "10 Example Data/assignments" OR "10 Example Data/games"
```
---

### Tasks
```tasks
not done   
LIMIT 10
```


## ⏳ Inbox — new today
(tasks not done path includes "Master TODO" false)
```tasks
not done
path does not include "Master TODO"
created today
```
## 🗓️ Scheduled / Waiting
(tasks not done due date)
```tasks
not done
has due date
```
## 🏁 Done this week
(tasks done on week this week)

```tasks
done
done on week this week
```