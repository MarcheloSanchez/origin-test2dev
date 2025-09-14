---
title: PROC – {{tp.prompt("Short, action-oriented title")}}
type: process
id: PROC-{{date:YYYYMMDD}}-{{tp.user.random(4)}}
status: draft                 # draft | in_review | active | deprecated | archived
version: 1.0.0
owner: Marcel
roles: [Author, Reviewer, Approver, Executor]
domain: PKM                   # PKM | QA | Ops | 3D | Admin | Research
scope: vault                  # vault | project | team
review_frequency: quarterly
last_review:
search_terms: []              # synonyms & alt names for search
dependencies: []              # [[PROC – …]], [[SOP – …]]
related: []                   # notes, MOCs
inputs: []                    # data, forms, permissions
outputs: []                   # artifacts, records
risk_level: low               # low | medium | high
compliance: []                # e.g., ISO, GDPR
toc: true
CHANGE_LOG: |
  - {{date}}: Created
---

## 🎯 Purpose
One sentence that states the outcome this process guarantees.

## 🧩 Scope & Preconditions
- Applies to …  
- Preconditions: accounts/permissions/data available

## 📦 Materials & Inputs
- …

## ▶ Steps
1. …
2. …
3. …

## 🔀 Decision Points
```mermaid
flowchart TD
A[Start] --> B{Condition?}
B -->|Yes| C[Path A]
B -->|No| D[Path B]
C --> E[End]
D --> E[End]
```
## 🚨 Exceptions & Rollback
- If X fails, do Y.
- Rollback steps…
## ✅ Outputs & Evidence
- Artifacts/logs to keep, where they live
## 🔎 Search & Discovery
- Keywords/synonyms (kept in `search_terms`)
- Link to glossary terms
## 📏 Quality & Metrics
- Success criteria, SLOs, check frequency
## 🧪 Test/Walkthrough
- Minimal scenario + expected results
## 📅 Review
- Frequency: {{review_frequency}} (next due auto-calculated)
- Reviewer: {{owner}} (or role)
## 🗒️ Run Log
|id|date|result|changes|notes|
|---|---|---|---|---|
> Tip: keep **Steps** terse; move explanations to **Notes/FAQ** sections linked at the bottom.
