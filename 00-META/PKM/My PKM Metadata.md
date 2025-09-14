
⬆️:: [[🏡Home]]
🗺️[[My PKM MOC]]
## Related
[[Templates]] - [[TemplateR]] - [[Templater Syntax]] - [[Templater Handbook 2025]]
[[Overview of Metadata - be aware query]]
---

## 🎯 Best Practices Summary

**Konzistence:** Vždy používej stejný formát a [[My PKM Metadata#Missing Metadata Query|naming conventions]]
**Minimální overhead:** Pouze metadata která skutečně používáš
**Automatizace:** Templater a QuickAdd snižují manual effort
**Evolution:** Metadata schema se vyvíjí s potřebami workflow
**Integration:** Propojeno s tag systémem a folder strukturou

---

## 📊 Universal Metadata Schema

### [[Base]] YAML Properties (Dublin Core inspired)

```
title: for query
type: atomic|project|source|MOC|meeting|person
status: 📥inbox|🔄active|⏳waiting|✅completed|📦archived
created: YYYY-MM-DD
modified: YYYY-MM-DD
related: [[]]
tags: 
```
---
## 🗂️ Hlavní organizační kategorie pro vault

### **1. Podle Content Lifecycle (ze search results)**
- [ ] [[🌱develop]] není implemetováno. Přijde mi jako redundantní info vzhledem k nadhledu.

| Fáze          | Složka              | Metadata                   | Účel                        |
| :------------ | :------------------ | :------------------------- | :-------------------------- |
| **Capture**   | 00-Inbox            | `lifecycle: "capture"`     | Zachycení nových informací  |
| **Process**   | 01-MOCs             | `lifecycle: "organize"`    | Strukturování a propojování |
| **Develop**   | 02-Dots, 03-Efforts | `lifecycle: "develop"`     | Aktivní rozvoj obsahu       |
| **Reference** | 04-Sources          | `lifecycle: "reference"`   | Pasivní reference materiály |
| **Journal**   | 05-Calendar         | `lifecycle: "journal"`     | Zápis do deníku             |
| **Archive**   | 06-Archive          | `lifecycle: "archived"`    | Dlouhodobé uložení          |
| **System**    | 99-System           | `lifecycle: "maintenance"` | Systémová údržba            |

---
## 🗂️ Metadata podle složkové struktury

### 00-[[Inbox]] Metadata

>**Účel:** Rychlé třídění a prioritizace při denním processing
>**Automatizace:** Templater auto-vyplní created, capture_method

```
title: "Quick Capture Item"
type: atomic
status: 📥inbox
created: 2025-06-08
tags: [\#📥inbox]
capture_method: [quickadd|manual|mobile|email]
processing_priority: [urgent|normal|low]
estimated_effort: [<5min|5-15min|15-30min|>30min]
```

### 01-[[MOC]] s Metadata

>**Účel:** Sledování pokrytí témat a aktuálnosti přehledů
>**Automatizace:** Dataview počítá linked_notes_count automaticky

```
title: "Topic Overview"
type: MOC
status: 🔄active
created: 2025-06-08
modified: 2025-06-08
tags: [\#🗺️MOC, \#topic-name]
coverage_areas: ["subtopic1", "subtopic2", "subtopic3"]
last_review: 2025-10-08
completeness: [draft|partial|comprehensive]
linked_notes_count: 15
review_frequency: weekly
```
### 02-[[Dot]] Metadata (Atomic Notes)

>**Účel:** Sledování vývoje nápadů od seed k evergreen
>**Automatizace:** Maturity tracking pro Recall & Reflect proces

```
title: "Single Concept"
type: atomic
status: 🔄active
created: 2025-06-08
modified: 2025-06-08
tags: [\#💡idea, \#topic-name]
maturity: 🌱seedling
source_inspiration: "[[Source Note]]"
related_concepts: ["concept1", "concept2"]
confidence_level: [high|medium|low|uncertain]
evidence_quality: [strong|moderate|weak|anecdotal]
```

### 03-[[99-System/FileClass/Effort|Effort]] Metadata (Projects)


>**Účel:** Projektové sledování a progress tracking
>**Automatizace:** Weekly review updates project_status

```
title: "Project Name"
type: project
status: 🔄active
created: 2025-06-08
modified: 2025-06-08
tags: [\#🚀project, \#domain-name]
project_status: active
deadline: 2025-07-01
effort_type: experiment
priority: high
energy: high
context: work
completion_percentage: 25
next_actions: ["action1", "action2"]
```

### 04-[[99-System/FileClass/Source|Source]] Metadata (References)

>**Účel:** Sledování čtení a hodnocení zdrojů
>**Automatizace:** key_insights_count počítán z odkazovaných Dots

```
title: "Book/Article/Video Title"
type: source
status: 🔄active
created: 2025-06-08
modified: 2025-06-08
tags: [\#📚source, \#domain-name]
source_type: book
source_author: "Author Name"
source_url: "https://..."
source_date: 2025-01-01
read_status: reading
isbn: "978-xxx-xxx"
rating: [1-5]
key_insights_count: 3
```

### 04-01 [[99-System/FileClass/Meeting]] metadata

```
meeting_date: YYYY-MM-DD
participants: ["person1", "person2"]
meeting_type: [standup|planning|review|retrospective]
action_items: ["item1", "item2"]
```
### [[03-PERIODIC]] Metadata
---
- [ ] #### 05-01-Daily Metadata

>**Účel:** Zapisování denní činnosti a reflexe
>**Automatizace:** Auto-přidáno při Ctrl+Alt+D (otevře se i při otevření vaultu)

```
energy: [low|medium|high]
mood: 
```
- [ ] #### 05-02-Weekly Metadata

>**Účel:** Zapisování denní činnosti a reflexe
>**Automatizace:** Auto-přidáno při Ctrl+Alt+XXX. Linkováno k jednotlivým Daily.

```

```
- [ ] #### 05-03-Monthly Metadata

>**Účel:** Zapisování denní činnosti a reflexe
>**Automatizace:** Auto-přidáno při Ctrl+Alt+XXXX Linkováno k jednotlivým Weekly.

```

```

- [ ] #### 05-04-Yearly Metadata

>**Účel:** Zapisování denní činnosti a reflexe
>**Automatizace:** Auto-přidáno při Ctrl+Alt+XXXX Linkováno k jednotlivým Monthly.
```

```
### 06-[[Archive]] Metadata

>**Účel:** Audit trail a retention management
>**Automatizace:** Auto-přidáno při Ctrl+Alt+A (Archive workflow)

```
tags: [\#📦archived, \#original-tags]
archive_reason: [completed|obsolete|superseded|low-value]
original_location: "03-Efforts"
retention_period: 2-years
```

---

## 🎯 Specialized Metadata Categories

### [[Maturity Tracking]] (Nick Ang inspired)

# PKM 4-State Pipeline: Seed → Note → Evergreen → Output
## 🔄 **State Definitions**
## 📤 **SEED** (Raw Capture)
**Purpose:** Immediate capture without friction  
**Entry:** Any new idea, thought, or information  
**Characteristics:** Unstructured, minimal metadata, inbox location  
**Exit Criteria:**
- Has clear title and type assigned
- Basic metadata complete (created, status, tags)
- Moved to appropriate folder (02-Dots, 03-Efforts, 04-Sources)
- **WIP Limit:** 15 items max
## 🌱 **NOTE** (Structured Knowledge)
**Purpose:** Developed, linked, actionable knowledge  
**Entry:** Seed with complete metadata and proper location  
**Characteristics:** Structured content, 2+ internal links, clear context  
**Exit Criteria:**
- 5+ internal links (dense connection)
- Referenced by 2+ other notes (proven value)
- Content is stable (no major rewrites needed)
- **WIP Limit:** 25 items max
## 🌲 **EVERGREEN** (Stable Reference)
**Purpose:** Foundational knowledge, frequently referenced  
**Entry:** Note with proven stability and connection density  
**Characteristics:** Comprehensive, authoritative, frequently linked  
**Exit Criteria:**
- Content published/shared externally
- Actionable output created (article, presentation, tool)
- Value demonstrated beyond personal use
- **WIP Limit:** No limit (stable state)
## 🍓 **OUTPUT** (External Value)
**Purpose:** Knowledge transformed into external deliverable  
**Entry:** Evergreen content ready for external consumption  
**Characteristics:** Published, shared, monetized, or productized  
**Exit Criteria:** Archive when no longer relevant/active  
**WIP Limit:** No limit (achievement state)
---
## ✅ **Note Promotion Checklist**
## 📤 → 🌱 (Seed to Note)
-  Title is clear and descriptive
-  Type assigned (atomic/project/source/meeting)
-  Basic tags applied (#context, [[priority]])
-  Moved from 00-Inbox to proper folder
-  Content has structure (headers, paragraphs)
-  At least 1 internal link added
## 🌱 → 🌲 (Note to Evergreen)
-  5+ internal links (outbound)
-  2+ backlinks (inbound references)
-  Content is comprehensive and complete
-  No major rewrites needed in 30+ days
-  Referenced in MOC or index note
-  Evidence quality is strong/moderate
## 🌲 → 🍓 (Evergreen to Output)
-  Content adapted for external audience
-  Published on external platform
-  Generates external engagement/value
-  Creates actionable outcome
-  Demonstrates real-world application
-  Archive-ready when lifecycle complete

**Workflow integration:**
- Weekly Recall & Reflect aktualizuje maturity
- Dataview sleduje distribution across maturity levels
- Templates automaticky začínają jako 📤seed

```
maturity: 📤seed      \# Seedbox - items actively working on
maturity: 🌱seedling  \# Grown from literature, needs incubation
maturity: 🪴sapling   \# Ready for dense linking
maturity: 🌲evergreen \# Stable, fundamental knowledge
maturity: 🍓fruit     \# Original work, publishable
```

### **Energy & Context System (GTD inspired)**
- [ ] [[🌱develop]] not implemented
**Workflow integration:**
- Daily planning podle current energy level
- Context-based task filtering
- Time-of-day recommendations

```
energy: high    \# Requires full focus, creative work
energy: medium  \# Standard concentration needed
energy: low     \# Can do when tired, admin tasks

context: work     \# Office environment needed
context: home     \# Personal space
context: computer \# Digital tools required
context: calls    \# Phone/video calls
context: errands  \# Outside activities
```

```
# Enhanced GTD metadata
action_required: true | false
waiting_for: "person" | "event" | "date"
energy_required: "high" | "medium" | "low"
time_required: "<5min" | "5-15min" | "15-30min" | ">30min"
context_required: "computer" | "phone" | "office" | "errands"
```

## Priority Matrix

**Automatizace:**
- QuickAdd templates s priority prompts
- Daily dashboard filtruje podle priority
- Weekly review přehodnocuje priority

```

priority: high    \# Urgent \& Important (Do First)
priority: medium  \# Important, Not Urgent (Schedule)
priority: low     \# Urgent, Not Important (Delegate)
priority: someday \# Neither Urgent nor Important (Eliminate)

```


## 🤖 Automation Integration

### Templater Auto-Fill Scripts - APPLIED 

```
// Auto-metadata pro nové poznámky
title: "<% tp.file.title %>"
created: "<% tp.date.now("YYYY-MM-DD") %>"
modified: "<% tp.date.now("YYYY-MM-DD") %>"
author: "Your Name"
```

// Context-based auto-tagging - NOT APPLIED 
```
<%
const hour = moment().hour();
let context = "work";
if (hour < 9 || hour > 17) context = "home";
%>
```
context: <%= context %>

// Auto-maturity based on folder
```
<%
const folder = tp.file.folder(true);
let maturity = "📤seed";
if (folder.includes("Sources")) maturity = "🌱seedling";
%>
```
maturity: <%= maturity %>
### Dataview Queries pro Metadata Analytics

```
TABLE
status,
maturity,
priority,
date(created) as Created
FROM ""
WHERE status = "🔄active"
SORT priority DESC, created ASC
```

## **Use Query Display Fields**

In **Dataview**, pull `title:` instead of `file.name`:

```
TABLE title, status, modified
FROM "03-Efforts"
SORT modified DESC
```
- Displays emoji-rich titles in your dashboards
- Keeps your actual filenames emoji-free

## Vault-Specific Metadata

*Přizpůsobení pro tento vault:*

- [ ] Doplnit specifická pole
- [ ] Definovat custom typy
- [ ] Upravit status hodnoty


---

# Missing Metadata Query 
> LIMITED TO 10
```dataview
TABLE WITHOUT ID file.name as "Note", 
!status as "❌ Missing status", 
!type as "❌ Missing type", 
!tags as "❌ Missing tags"
FROM ""
WHERE !status OR !type OR !tags
SORT file.name ASC
LIMIT 10
```

### **Orphan Notes Query:**

```dataview-working
LIST  
FROM ""  
WHERE length(file.inlinks) = 0 AND length(file.outlinks) = 0  
AND !contains(file.path, "Templates")  
SORT file.name
```

### **Stale Notes (Not Modified Recently):**

```dataview-not-working
LIST file.mtime as "Last Modified"  
FROM ""  
WHERE file.mtime < date(today) - dur(30 days)  
SORT file.mtime ASC  
LIMIT 10
```

