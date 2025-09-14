---
title: 🎞️ Productivity — Meeting → Actions → Decision
fileClass: Prompt
type: playlist
status: vetted
tags: ["🤖AI/playlist","productivity"]
created: 2025-09-07
modified: 2025-09-07
role: [facilitator]
audience: [strategist, entrepreneur, developer]
difficulty: intermediate
format: [outline, table, checklist]
id: pl-productivity-meeting-actions-decision
intent: [analyze, apply, evaluate]
language: [en, cs]
length: medium
owner: "library-core"
prompt_category: ["Productivity"]
prompt_subcategory: ["Meetings","Tasking & Checklists","Decision Support"]
prompt_type: planning
summary: Produce agenda, notes, action items, and a decision log.
tone: neutral
tools: []
version: "1.0.0"
---

**Objective:** Produce clean notes + decision record.  
**Outcome bundle:** Agenda.md, Notes.md, Action Items.md, Decision Log.md

**Entry criteria:** Meeting goal, constraints, attendees.  
**Exit criteria:** All actions have owners/dates; decisions have rationale.

## Steps
1) [[Ops – Meeting Agenda Builder]]  
   Include → ![[Persona – Facilitator]] + ![[Guardrail – Meeting Discipline]] + ![[Format – Meeting Pack]]
2) [[Ops – Live Notes Extractor]] → Notes.md
3) [[Ops – Action Extractor]] → Action Items.md
4) [[Ops – Decision Log Writer]] → Decision Log.md
5) Review Gate ✅ → ![[Rubric – Meeting Effectiveness (5pt)]]

## Risks & Safeguards
- Side-tracks → use parking lot (guardrail).
- Ownerless actions → facilitator assigns before close.
