---
title: 🎞️ Writing — Research → Outline → Draft → Edit → SEO
fileClass: Prompt
type: playlist
status: vetted
tags: ["🤖AI/playlist","writing"]
created: 2025-09-07
modified: 2025-09-07
role: [editor]
audience: [content-creator, developer, researcher]
difficulty: intermediate
format: [outline, checklist, table]
id: pl-writing-research-outline-draft-edit-seo
intent: [analyze, create, evaluate]
language: [en, cs]
length: medium
owner: "library-core"
prompt_category: ["Writing"]
prompt_subcategory: ["Blog Posts","Technical Docs","Copywriting/Ads"]
prompt_type: planning
summary: Ship an SEO-ready article from brief to polish.
tone: clear
tools: []
version: "1.0.0"
---

**Objective:** Produce a clean, publishable article with SEO titles/descriptions.  
**Outcome bundle:** Topic Brief.md, Blog Outline.md, Draft v1.md, Edit Notes.md, SEO Titles+Descriptions.md

**Entry criteria:** Topic, audience, angle; any mandatory sources.  
**Exit criteria:** ≤1200 words; 3+ H2s; no unverified claims.

## Steps
1) [[Research – Topic Brief]] → Brief  
   Include → ![[Guardrail – No Hallucinations]]
2) [[Writing – Blog – Outline – Technical]] → Outline  
   Include → ![[Persona – Editor]] + ![[Format – Blog Outline]]
3) [[Writing – Draft – First Pass]] → Draft v1
4) [[Writing – Edit – Clarity & Flow]] → Edit Notes  
   Review Gate ✅ → ![[Rubric – Writing Clarity & SEO (5pt)]]
5) [[Writing – SEO – Titles & Descriptions]] → SEO sheet

## Risks & Safeguards
- Unsupported claims → cite inputs or rewrite to neutral.
- Overlong sections → enforce “Key Takeaways” count.
