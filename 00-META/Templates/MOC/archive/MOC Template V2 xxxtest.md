---
title: "MOC – <% t = tp.file.title.replace(/^MOC – /,'') %><%* %>"
aliases: ["<% tp.file.title %>"]
tags: [moc, <% tp.file.title.replace(/^MOC – /,'').toLowerCase() %>]
moc: true
status: seed
created: <% tp.date.now(DATEFORMAT || "YYYY-MM-DD") %>
updated: <% tp.date.now(DATEFORMAT || "YYYY-MM-DD") %>
---

[[00–META|⬆ Meta Index]]

# <% tp.file.title %>

> **Abstract**  
> 2–4 sentences defining scope and intent. State what belongs here vs. elsewhere.

## Core Subtopics
- **Models & Frameworks**: [[<% tp.user.stub("Model/Framework") %>]]
- **Skills**: [[<% tp.user.stub("Skill") %>]]
- **Contexts**: [[<% tp.user.stub("Context") %>]]
- **Channels & Tools**: [[<% tp.user.stub("Tool/Channel") %>]]
- **Anti-patterns**: [[<% tp.user.stub("Anti-pattern") %>]]

## Hand-picked Starting Points
- [[<% tp.user.stub("Anchor 1") %>]]
- [[<% tp.user.stub("Anchor 2") %>]]

## Open Questions
- What recurring problems does this MOC help me solve?
- Which 3 notes deserve promotion to “anchors”?

## Future Ideas / Next Actions
- [ ] Convert rough notes into evergreen children
- [ ] Add 2+ links per new child note
- [ ] Schedule a weekly “garden” pass

## See Also
- [[<% tp.user.stub("Related MOC") %>]]