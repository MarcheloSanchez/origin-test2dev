⬆️:: [[🏡Home]]
## Templates
[[Template, Daily Note|Template, Daily Note]]
[[Week Review v2]]
[[Template, Monthly Review]]
[[Template, New SlipBox]]

# Features
Denní poznámky — „05 Calendar/Daily“ + tlačítka/šablony (link)
Týdenní review — checklists + panely dokončeného / stagnujícího
Měsíční přehledy — archiv, refaktoring struktury, zálohy
Produktivita & metriky — [[Performance Metrics]] (tag coverage, capture rate)
Plánované rituály — odkazy na „Review scripts/templaty“ v [[System & Automation]]
Highlight stream — výběr „highlight::“ z deníků (Dataview panel)

## Rollup last 14 days of Highlight
```dataview
TABLE WITHOUT ID file.link AS "Day", highlight AS "Highlights"
FROM "05-Calendar/Daily"
WHERE date(file.name) >= date(today) - dur(14 days)
SORT file.name DESC
```
# Periodic Workflow
## Daily
1. Create Daily note via template.
2. Review Inbox and plan tasks.
## Weekly
1. Summarize week using Weekly template.
2. Update Project statuses.
## Monthly
1. Reflect on progress with Monthly template.
2. Archive completed projects.

Also templates can be:
- Daily Notes
- Meeting Notes
- Workout Notes
- Log Notes
- Tracking Notes
- Outputted Materials: Articles, Speeches, etc

---

Our ideas and experiences are wrapped up in a linear movement we call **Time**. It's a great way to organize and remember stuff. Here's how you can make Time work for you:

- ***Usefully***, you can track down old notes by Time, be reminded of distant memories, and even emotionally transport back to an echo of Past You.
- ***Practically***, you can rapidly capture an idea that sparks, quickly take meeting notes, and even log things you care about tracking.
- ***Creatively***, you can journal get your thoughts out, or freewrite to get your mind unstuck.
- ***Productively***, you can plan your actions for the day, goals for the week, or even intentions for the year—and beyond.
- ***Reflectively***, you can review past notes, compile previous thoughts, and even synthesize old notes into new insights and consolidated wisdom.

Notes allow you to time travel. It's how Present You can receive messages from Past You and send messages to Future you. 