---
title: Add
type: MOC
status: 🔄active 
tags: [[📥inbox]] 
created: 2025-09-06
modified: 2025-09-06
related:
capture_method: templater
completeness:
coverage_areas:
estimated_effort:
fileClass: Base, MOC
last_review:
linked_notes_count:
processing_priority:
review_frequency:
---

- [ ] review
⬆️:: [[🏡Home]]

This **Add** note isn't just an inbox. It's a cooling pad 🧊.
Thoughts come in hot. But after a few days, they cool down.
When cooler thoughts prevail, you can better prioritize. Cool?

> [!activity]+ ## Added Stuff
> This view looks at the 10 newest notes in your **+** folder. As you process each note: add a link, add details, move them to the best folder, and delete everything that no longer sparks ✨.
>
> ```dataview
> TABLE WITHOUT ID
>  file.link as "",
>  (date(today) - file.cday).day as "Days alive"
>
> FROM "00 Inbox" 
>
> SORT file.cday desc
>
> LIMIT 10
> ```

---
