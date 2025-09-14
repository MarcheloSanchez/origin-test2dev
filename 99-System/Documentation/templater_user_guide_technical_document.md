# Obsidian Templater — User Guide (Technical Document)

## 1) Overview

### Purpose

- Provide a practical workflow for using **Templater** to speed up note creation (daily notes, projects, meetings, reviews).
- Explain the **tp API** (Templater’s JavaScript helpers) with copy‑paste examples.
- Help you diagnose common errors and set sensible defaults.

### Prerequisites

- **Obsidian** installed (v1.x) and a vault.
- **Templater** community plugin enabled: *Settings → Community plugins → Browse → Templater → Install & Enable*.
- A **Templates** folder in your vault (e.g., `04-Templates/`).
- (Optional) Familiarity with basic JavaScript syntax.

### Key Concepts

- **Template file:** A normal Markdown file containing Templater code blocks.
- **Inline tags:**
  - `<% … %>` → evaluate an expression and **output** the result.
  - `<%* … %>` → run multi‑line JS/async code; **append to **`` to output.
  - `tR` is the *template result* string you build in `<%* %>` blocks.
- ``** namespace:** Helper API, e.g. `tp.date`, `tp.file`, `tp.system`, `tp.user`.
- **User scripts:** Your custom JS functions in a configured folder; callable as `tp.user.<fileName>(...)`.
- **Folder templates:** Auto‑apply a template when creating a file in a specific folder.

---

## 2) Step‑by‑Step Guide

### 2.1 Install & Configure

1. Install **Templater** (see prerequisites).
2. Open **Settings → Templater** and set:
   - **Template folder location:** `04-Templates/` (or your folder)
   - **User scripts folder location:** `04-Templates/_scripts/` (recommended)
   - **Trigger Templater on new file creation:** ON
3. Set hotkeys (Settings → Hotkeys):
   - *Templater: Insert template* → e.g., `Ctrl/Cmd+T`
   - *Templater: Create new note from template* (optional)

### 2.2 Your First Template (Daily Note)

Create `04-Templates/Daily.md` with:

```markdown
---
created: <% tp.date.now("YYYY-MM-DDTHH:mm") %>
aliases: ["Day <% tp.date.now("YYYY-MM-DD") %>"]
tags: [daily]
---

# <% tp.file.title %>

## 🌞 Gratitude
-

## 🧠 Learnings
-

## ✅ Top 3
- [ ]
- [ ]
- [ ]

<% tp.file.cursor() %>
```

Use **Command Palette → Templater: Insert template** to apply it.

### 2.3 Parameters, Prompting & Suggesters

**Simple prompt** (use `tp.system.prompt`, not `tp.user.prompt`):

```markdown
<%* const topic = await tp.system.prompt("Topic?"); tR += `# ${topic}` %>
```

**Suggester** (no typos, pre‑defined values):

```markdown
<%*
const choice = await tp.system.suggester(
  ["Work", "Personal", "Learning"],
  ["work", "personal", "learning"],
  true // throwOnCancel
);
tR += `tags: [area/${choice}]`;
%>
```

### 2.4 Includes & Modular Templates

Create partials (e.g., `04-Templates/_parts/Review.md`) and include:

```markdown
<%* tR += await tp.file.include("[[04-Templates/_parts/Review]]") %>
```

Keep templates small and compose them with includes.

### 2.5 Useful `tp` Snippets (Copy‑paste)

- **Dates & links to neighbors:**

```markdown
Yesterday: [[<% tp.date.now("YYYY-MM-DD", -1, "days") %>]]
Tomorrow:  [[<% tp.date.now("YYYY-MM-DD",  1, "days") %>]]
```

- **Rename note to slug:**

```markdown
<%* await tp.file.rename(tp.file.title.replace(/\s+/g, "-").toLowerCase()); %>
```

- **Move note to a folder:**

```markdown
<%* await tp.file.move(`Projects/${tp.file.title}`) %>
```

- **Insert frontmatter key if missing:**

```markdown
<%*
const f = tp.frontmatter || {};
if (!f.status) {
  await app.fileManager.processFrontMatter(tp.file.find_tfile(tp.file.path(true)), fm => fm.status = "active");
}
%>
```

- **Append below current heading:**

```markdown
<%* await tp.file.insert("\n- [ ] New item", false) %>
```

### 2.6 Folder Templates (Auto‑apply)

In **Settings → Templater → Folder Templates** add rows, e.g.:

- Folder: `05-Calendar/Daily` → Template: `04-Templates/Daily`
- Folder: `03-Efforts` → Template: `04-Templates/Project` Now creating a file in these folders auto‑applies the template.

### 2.7 User Scripts (Custom Functions)

1. Create `04-Templates/_scripts/slugify.js`:

```js
module.exports = async (tp, str) => {
  return (str ?? tp.file.title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};
```

2. Call it in a template:

```markdown
<%* const slug = await tp.user.slugify(tp, tp.file.title); await tp.file.rename(slug) %>
```

> The function name is the **filename** without extension.

### 2.8 Common Issues & Fixes

- `` → Check for unmatched `<% %>`; use `<%* %>` for any `await` code; make sure you append output via `tR +=` inside `<%* %>`.
- `` → Use `` (built‑in). `tp.user.*` requires you to create a *user script* of that name.
- **Template not triggering on new file** → Turn on *Trigger Templater on new file creation* and configure **Folder Templates** for that folder.
- **Conflicts with Core Templates plugin** → If both are used, assign **different hotkeys** and disable *Automatically apply* in the core plugin to avoid double insertion.
- ``** not found** → Use a valid wiki‑link to the partial, e.g., `[[04-Templates/_parts/Review]]` and ensure the file exists.

### 2.9 Best Practices

- Keep templates **atomic**; compose with `include`.
- Prefer **suggester** over free‑text prompts for consistent metadata.
- Use **Conventional Headings** and a consistent YAML schema.
- Put complex logic into **user scripts**; keep templates readable.
- Test templates in a **Scratch** note before automating.

---

## 3) Reference Section

### 3.1 `tp` Namespaces (Essentials)

- `tp.date.now(format?, offset?, unit?)` → e.g., `tp.date.now("YYYY-MM-DD", -1, "days")`.
- `tp.file.title` / `tp.file.path(true)` / `tp.file.folder(true)`.
- `tp.file.cursor()` → place caret.
- `tp.file.rename(newName)` / `tp.file.move(path)` / `tp.file.include("[[Note]]")` / `tp.file.insert(text, to_top=false)`.
- `tp.system.prompt(msg)` / `tp.system.suggester(labels, values, throwOnCancel?)`.
- `tp.frontmatter` (read) and `app.fileManager.processFrontMatter(file, fn)` (write via Obsidian API).
- `tp.user.<scriptName>(tp, ...args)` for custom functions.

### 3.2 Template Syntax Cheatsheet

```md
<% expression %>         # Output value of expression
<%* /* code */ %>        # Multi-line/async; use tR += "text" to output
<%* tR += `Hello` %>     # Append to result
```

### 3.3 Practical Examples

**A) Meeting Note Template**

```markdown
---
type: meeting
date: <% tp.date.now("YYYY-MM-DD") %>
with: <%* tR += await tp.system.prompt("With who?") %>
---

# <% tp.file.title %>
## Agenda
-

## Notes
-

## Action Items
- [ ] Owner:  Due:
```

**B) Project Note Skeleton**

```markdown
---
status: idea
priority: medium
tag: [project]
---

# <% tp.file.title %>

**Goal**:

**Milestones**
- M1 —
- M2 —

<%* tR += await tp.file.include("[[04-Templates/_parts/Review]]") %>
```

**C) Daily Review Partial (**``**)**

```markdown
## 🔁 Review
- What went well?
- What could be improved?
- What will I do tomorrow?
```

### 3.4 Advanced: Update Frontmatter Safely

```markdown
<%*
const file = tp.file.find_tfile(tp.file.path(true));
await app.fileManager.processFrontMatter(file, fm => {
  fm.updated = tp.date.now("YYYY-MM-DDTHH:mm");
  fm.status = fm.status ?? "active";
});
%>
```

### 3.5 Troubleshooting Checklist

- Run the template in a blank note to isolate errors.
- Ensure ``** only inside **`` blocks.
- Log values while debugging: `<%* console.log({title: tp.file.title}); %>` (check DevTools).
- If a script call fails, confirm the **user script filename** and export.

---

## 4) Quick Cheat Sheet (1‑Minute)

```md
# Insert template: Ctrl/Cmd+T
Date: <% tp.date.now("YYYY-MM-DD") %>
Cursor: <% tp.file.cursor() %>
Prompt: <%* tR += await tp.system.prompt("Question?") %>
Suggest: <%* const v = await tp.system.suggester(["A","B"],["a","b"]); tR += v %>
Include: <%* tR += await tp.file.include("[[04-Templates/_parts/Block]]") %>
Rename: <%* await tp.file.rename(tp.file.title.toLowerCase().replace(/\s+/g,'-')) %>
Move: <%* await tp.file.move(`Area/${tp.file.title}`) %>
```

*End of document.*

## 5) Ready‑made Templates (Copy & Use)

### 5.1 Daily Note — `04-Templates/Daily.md`

```markdown
---
date: <% tp.date.now("YYYY-MM-DD") %>
created: <% tp.date.now("YYYY-MM-DDTHH:mm") %>
aliases: ["<% tp.date.now("YYYY-MM-DD") %> Daily"]
tags: [daily]
---

# <% tp.file.title %>

> Vlož do názvu souboru formát `YYYY-MM-DD` a ulož do `05 Calendar/Daily`.

**Dnes**: <% tp.date.now("dddd, D. MMMM YYYY") %>

**Včera**: [[<% tp.date.now("YYYY-MM-DD", -1, "days") %>]] · **Zítra**: [[<% tp.date.now("YYYY-MM-DD", 1, "days") %>]]

## ✅ Top 3
- [ ] 
- [ ] 
- [ ] 

## 💭 Reflections & Ideas
### 🌞 Za co jsem vděčný?
- 

### 🧠 Co mě zaujalo/naučilo?
- 

### 💭 Emoce zažita?
- 

highlight:: 

<% tp.file.cursor() %>
```

---

### 5.2 Weekly Note — `04-Templates/Weekly.md`

```markdown
---
week: <% tp.date.now("GGGG-[W]WW") %>
created: <% tp.date.now("YYYY-MM-DDTHH:mm") %>
tags: [weekly]
---

# Týden <% tp.date.now("GGGG-[W]WW") %>

<%*
const m = (window.moment || moment)();
const start = m.clone().startOf('isoWeek');
const end   = m.clone().endOf('isoWeek');
const fmt = s => s.format('YYYY-MM-DD');
const days = [...Array(7)].map((_,i)=> start.clone().add(i,'days'));
tR += `**Období:** ${fmt(start)} → ${fmt(end)}

`;
tR += `## 📆 Daily odkazy
` + days.map(d=>`- [[${d.format('YYYY-MM-DD')}]] (${d.format('ddd')})`).join('
') + '

';
%>

## 🔁 Týdenní review
- Co šlo dobře?
- Co zlepšit příště?
- Na co se zaměřím další týden?

## ✅ Uzavřeno tento týden
- 

## 📈 Statistika (volitelné)
- Počet dokončených úkolů: 
- Tréninky/hodiny: 
- Učení/hodiny: 
```

---

### 5.3 Effort (Projekt) — `04-Templates/Effort.md`

```markdown
---
type: effort
status: idea
phase: discovery
priority: <%* tR += await tp.system.suggester(["low","medium","high"],["low","medium","high"], true) %>
area: <%* tR += await tp.system.suggester(["work","personal","learning"],["work","personal","learning"], true) %>
owner: Marcel Machanec
created: <% tp.date.now("YYYY-MM-DD") %>
due: 
tags: [effort]
---

# <% tp.file.title %>

## 🎯 Goal
- 

## 🗺️ Scope & Constraints
- In scope: 
- Out of scope: 

## 📍 Milestones
- M1 — 
- M2 — 

## ✅ Checklist
- [ ] 

## 📝 Log
### <% tp.date.now("YYYY-MM-DD") %>
- 
```

---

## 6) User Scripts Library — `04-Templates/_scripts/`

> Vytvoř složku `_scripts` v Templates a ulož níže uvedené soubory. Volání: `await tp.user.<scriptName>(tp, ...)`.

### 6.1 `slugify.js`

```js
module.exports = async (tp, str) => {
  return (str ?? tp.file.title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};
```

### 6.2 `weekLinks.js` — vygeneruje odkazy na dny v aktuálním ISO týdnu

```js
module.exports = async (tp) => {
  const m = (window.moment || moment)();
  const start = m.clone().startOf('isoWeek');
  const days = [...Array(7)].map((_,i)=> start.clone().add(i,'days').format('YYYY-MM-DD'));
  return days.map(d=>`- [[${d}]]`).join('
');
};
```

### 6.3 `quickEffort.js` — založí nový Effort z šablony

```js
module.exports = async (tp, title) => {
  const slug = (await tp.user.slugify(tp, title));
  const target = `03 Efforts/${slug}.md`;
  // Vytvoří nový soubor ze šablony a neotevře ho
  await tp.file.create_new('04-Templates/Effort', target, false);
  return target;
};
```

### 6.4 `addTaskWithDatestamp.js` — vloží úkol s datem

```js
module.exports = async (tp, text) => {
  const stamp = tp.date.now('YYYY-MM-DD');
  await tp.file.insert(`
- [ ] ${text} ⏱ ${stamp}`, false);
};
```

### 6.5 `setFrontmatter.js` — bezpečně nastaví klíče ve frontmatteru

```js
module.exports = async (tp, updates = {}) => {
  const file = tp.file.find_tfile(tp.file.path(true));
  await app.fileManager.processFrontMatter(file, fm => {
    for (const [k,v] of Object.entries(updates)) fm[k] = v;
  });
};
```

---

## 7) Suggested Folder Templates (Templater → Folder Templates)

- Folder: `05 Calendar/Daily` → Template: `04-Templates/Daily`
- Folder: `05 Calendar/Weekly` → Template: `04-Templates/Weekly`
- Folder: `03 Efforts` → Template: `04-Templates/Effort`

*End of document.*

