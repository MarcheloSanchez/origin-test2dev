---
title: 🎞️ Education — Lesson → Quiz → Key → Feedback
fileClass: Prompt
type: playlist
status: vetted
tags: ["🤖AI/playlist","education"]
created: 2025-09-07
modified: 2025-09-07
role: [teacher]
audience: [teacher, student]
difficulty: intermediate
format: [outline, checklist]
id: pl-education-lesson-quiz-key-feedback
intent: [create, evaluate]
language: [en, cs]
length: medium
owner: "library-core"
prompt_category: ["Education"]
prompt_subcategory: ["Lesson Design","Assessment","Feedback & Rubrics"]
prompt_type: planning
summary: Deliver a micro-lesson kit with quiz, answer key, and feedback prompts.
tone: clear
tools: []
version: "1.0.0"
---

**Objective:** Ship a complete micro-lesson kit.  
**Outcome bundle:** Lesson Plan.md, Quiz (5).md, Answer Key.md, Feedback Prompts.md

**Entry criteria:** Topic + target level (Bloom), prior knowledge list.  
**Exit criteria:** One question per level up to Analyze; answer key present.

## Steps
1) [[Edu – Lesson Design (Objectives & Activities)]]  
   Include → ![[Persona – Tutor]] + ![[Guardrail – Education Safety]] + ![[Format – Lesson Plan]]
2) [[Edu – Quiz Builder (5Q, Bloom-aligned)]]  
   Include → ![[Persona – Tutor]] + ![[Format – Quiz (5Q)]]
3) [[Edu – Answer Key & Explanations]]  
   Include → ![[Persona – Tutor]] + ![[Guardrail – No Hallucinations]]
4) Review Gate ✅ → ![[Rubric – Lesson Quality (5pt)]]

## Risks & Safeguards
- Scope creep → keep objective to one lesson.
- Misalignment → check Bloom intent tags match questions.
