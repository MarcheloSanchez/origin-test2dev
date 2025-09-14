
⬆️:: [[🏡Home]]
[Link for documentation](https://silentvoid13.github.io/Templater/introduction.html)
[[👤 Templater Guide]]
[[Templater Handbook 2025]]

Use this to order metadata: 
```
<%* tp.user.yaml_reorder(tp) %>
```
## Templates vs. Templater - Rozdíly a automatizace
 ### **Core Templates plugin:**
- Základní šablony bez logiky
- Statické náhrady textu
- Jednoduchá implementace
 ### **Templater plugin (doporučeno):**
- Dynamické šablony s JavaScript logikou
- Automatické vyplňování podle kontextu
- User prompts a podmíněná logika

---
# Where do the “other” things go?
Use this **decision tree**:
- **Produces a standalone note?** → put it in that **Type** (Effort/Dot/…).
- **Only a piece you add inside a note?** → **_Common/Blocks/**
- **Reusable fragment included by many types?** → **_Common/Partials/**
- **Has logic/flow or multiple steps?** → **_Common/Wizards/**
- **Helper code or utilities?** → **_Common/Utilities/templater/**
- **Plain snippets (text/code)** → **_99-System/Scripts/**
- **Examples/tests/scratch** → **_Common/Tests/**
- **Old but keep for reference** → **_Deprecated/yyyy-mm-dd/**
>This keeps your **Type folders pure** and your **Common folder powerful**.
---
## [[abbreviations]]
For use inside Obsidian, adopt these **unique, collision-proof template abbreviations**:

Example:
`EF-TM-M0`
`Effort-Meta-only`

## Type Codes
- `EF` = Effort (project)
- `AT` = Atomic/Dot (atomic note)
- `SC` = Source (reference)
- `MT` = Meeting
- `MC` = MOC (Map of Content)
- `DY` = Daily/Calendar
## Family Codes
- `TM` = Meta (YAML/frontmatter)
- `TC` = Create (blank/auto)
- `TA` = Add (Templater logic)
- `TQ` = Quick (pre-filled)
## Action Codes
- `M0` = Meta only
- `C1` = Chapters/body
- `CE` = Create empty
- `CA` = Create auto
- `AM` = Add meta
- `AC` = Add chapters
- `RB` = Reset body
- `RM` = Reset meta
**Shortcut Example:**  
Typing `AT-TM-C1` instantly picks “Atomic Template – Chapters/body.”  
No single-code overlaps — every abbreviation is unique for search and launch
---
# Folder/File structure

```
Templates/
  Effort/
    00.Meta.yaml.md          # frontmatter-only
    10.Chapters.body.md      # headings/body only
    20.Create.empty.md       # meta+body, you fill
    30.Create.auto.md        # meta+body, auto defaults
    40.AddMeta.md            # add meta to current note
    50.AddChapters.md        # add/replace body in current note
    90.ResetBody.md          # keep YAML, reset body
  Dot/                       # same pattern as Effort/
  Source/
  Meeting/
  MOC/
  Atomic/
  Daily/
  Prompt/

  _Common/
    Blocks/                  # insert-at-cursor “lego bricks”
      Context pack.md
      Quality Gate.md
      Open Tasks (DV).md
      Related & Backlinks (DVJS).md
    Partials/                # reusable fragments (no YAML)
      Callouts.md
      Tables.md
      Checklists.md
    Wizards/                 # multi-step builders (flow/logic)
      New Area Wizard.md
      Import Source Wizard.md
    Utilities/templater/     # Templater user scripts (JS)
      templates.js
      yaml.js
      strings.js
    Snippets/                # plain text/code snippets
      Prompt scaffolds.md
      Regex cheatsheet.md
    Styles/                  # CSS/callout examples for copy
      Callout palette.md
    Tests/                   # throwaway sandbox notes
      Effort.test.md
      Dot.test.md
  _Index.md                  # landing page with Dataview
  _Changelog.md              # what changed & why
  _Deprecated/2025-08-24/    # parked old files (keeps history)
```