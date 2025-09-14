---
id: <% tp.date.now("YYYYMMDDHHmm") %>
type: zettel
status: active
area: []
project: []
priority: M
due: 
created: <% tp.date.now("YYYY-MM-DD") %>
updated: <% tp.date.now("YYYY-MM-DD") %>
tags: [z/]
aliases: []
links: []
---
# <% tp.file.title %>

## Claim
- 

## Evidence
- 

## Links
```dataview
list from [[]]
where contains(file.outlinks, this.file.link)
```

## Tasks
```tasks
path includes <% tp.file.path(true) %>
```
