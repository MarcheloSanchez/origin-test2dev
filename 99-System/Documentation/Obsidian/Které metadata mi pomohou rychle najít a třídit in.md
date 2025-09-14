<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" class="logo" width="120"/>

# Které metadata mi pomohou rychle najít a třídit informace v vaultu

Na základě search results a LATCH metodologie navrhuji klíčové metadata pro rychlé vyhledávání a třídění v tvém Meta Vaultu:

## 🔍 Metadata pro rychlé vyhledávání (LATCH inspirované)

### **📍 Location-based Metadata** (kde se věci nacházejí)

```yaml
# Podle search results - rychlá navigace
folder_path: "02 Dots/Productivity"
vault_section: "knowledge" | "projects" | "archive" | "system"
collection: "PKM-system" | "learning-resources" | "work-projects"
physical_location: "office" | "home" | "mobile" | "anywhere"
```

**Účel:** Rychlé vyhledávání podle místa v systému
**Dataview query:** `WHERE folder_path CONTAINS "Productivity"`

### **🔤 Alphabetical Metadata** (textové vyhledávání)

```yaml
# Enhanced searchability ze search results
aliases: ["SR", "Species Richness", "Alpha Diversity"]
keywords: ["biodiversity", "ecology", "measurement"]
search_terms: ["synonyms", "abbreviations", "alternate-names"]
title_variations: ["formal-name", "informal-name", "acronym"]
```

**Účel:** Najít poznámku podle jakéhokoliv názvu nebo synonyma
**Implementace:** Obsidian Quick Switcher (Ctrl+O) automaticky prohledává aliases

### **⏰ Time-based Metadata** (temporální třídění)

```yaml
# Temporal organization ze search results
created: "2025-06-08"
modified: "2025-06-08"
due_date: "2025-06-15"
review_date: "2025-06-15"
time_sensitivity: "urgent" | "this-week" | "this-month" | "someday"
recurrence: "daily" | "weekly" | "monthly" | "annual" | "one-time"
```

**Účel:** Časové třídění a deadline management
**Dataview query:** `WHERE due_date >= date(today) AND due_date <= date(today) + dur(7 days)`

### **📂 Category Metadata** (podle typu obsahu)

```yaml
# Content categorization ze search results
content_type: "atomic" | "project" | "source" | "moc" | "template"
domain: "productivity" | "learning" | "technology" | "personal"
complexity: "beginner" | "intermediate" | "advanced" | "expert"
completion_status: "draft" | "in-progress" | "review" | "final"
source_type: "book" | "article" | "video" | "podcast" | "experience"
```

**Účel:** Kategoriální filtrování podle typu a domény
**Dataview query:** `WHERE content_type = "atomic" AND domain = "productivity"`

### **📊 Hierarchy Metadata** (strukturální vztahy)

```yaml
# Hierarchical relationships ze search results  
parent_topic: "[[Main Topic]]"
child_topics: ["[[Subtopic 1]]", "[[Subtopic 2]]"]
depth_level: 1-5
dependency_level: "prerequisite" | "core" | "advanced" | "optional"
reference_count: 5
backlink_count: 3
```

**Účel:** Navigace v hierarchii znalostí
**Dataview query:** `WHERE parent_topic = "[[PKM System]]" SORT depth_level ASC`

## ⚡ Fast Access Metadata (pro Quick Switcher)

### **Priority Quick Filters**

```yaml
# Speed-optimized metadata ze search results
quick_access: true          # Pro nejpoužívanější poznámky
dashboard_item: true        # Zobrazit v dashboardu
hotkey_linked: "Ctrl+Q"     # Propojeno se zkratkou
frequency_used: "daily" | "weekly" | "monthly" | "rare"
last_accessed: "2025-06-08"
```

**Implementace:**

- Quick Switcher s `quick_access:true` filtr
- Dashboard query: `WHERE dashboard_item = true`


### **Search Performance Metadata**

```yaml
# Optimized for search performance
index_priority: "high" | "medium" | "low"
search_weight: 1-10         # Váha ve vyhledávání
featured: true              # Prioritní výsledky
bookmark: true              # Označené poznámky
```


## 🎯 Specific Use Case Metadata

### **GTD Workflow Support** (podle search results discusse)

```yaml
# Enhanced GTD metadata
action_required: true | false
waiting_for: "person" | "event" | "date"
energy_required: "high" | "medium" | "low"
time_required: "<5min" | "5-15min" | "15-30min" | ">30min"
context_required: "computer" | "phone" | "office" | "errands"
```

**Dataview filtr:** `WHERE energy_required = "low" AND context_required = "computer"`

### **Learning \& Research Metadata**

```yaml
# Academic-inspired ze search results
confidence_level: "high" | "medium" | "low" | "uncertain"
evidence_quality: "strong" | "moderate" | "weak" | "anecdotal"
understanding_level: "beginner" | "working" | "teaching" | "mastery"
learning_stage: "discover" | "understand" | "apply" | "teach"
```


## 📋 Implementation Strategy

### **Week 1: Essential Search Metadata**

```yaml
# Minimize pero maximální utility
title: "Required"
aliases: ["synonym1", "synonym2"]  
content_type: "atomic|project|source"
created: "2025-06-08"
quick_access: true|false
```


### **Week 2: Temporal \& Priority**

```yaml
due_date: "2025-06-15"
priority: "high|medium|low"
frequency_used: "daily|weekly|monthly"
review_date: "2025-06-15"
```


### **Week 3: Advanced Filtering**

```yaml
domain: "productivity|learning|technology"
energy_required: "high|medium|low"
time_required: "<5min|5-15min|15-30min|>30min"
context_required: "computer|phone|office"
```


## 🔍 Dataview Query Examples

### **Daily Dashboard Query**

```dataview
TABLE content_type, priority, due_date
FROM ""
WHERE quick_access = true OR due_date >= date(today)
SORT priority DESC, due_date ASC
```


### **Learning Progress Query**

```dataview
TABLE understanding_level, last_accessed, review_date  
FROM ""
WHERE domain = "learning" AND content_type = "atomic"
SORT understanding_level ASC, review_date ASC
```


### **Quick Actions Query**

```dataview
LIST
FROM ""
WHERE time_required = "<5min" AND energy_required = "low"
SORT frequency_used DESC
```

Tato metadata struktura podporuje jak manuální vyhledávání (Quick Switcher), tak automatizované dotazy (Dataview) při zachování simplicity a performance.

<div style="text-align: center">⁂</div>

[^1]: https://developer.veevavault.com/vql

[^2]: https://www.reddit.com/r/ObsidianMD/comments/zw0pxg/resources_for_metadata_and_basic_organization/

[^3]: https://www.ibm.com/docs/es/SS8NLW_12.0.0/com.ibm.swg.im.infosphere.dataexpl.engine.tut.md.doc/t_vse-mt-sortby-metadata.html

[^4]: https://www.youtube.com/watch?v=vS-b_RUtL1A

[^5]: https://effortlessacademic.com/8-must-know-hacks-for-academic-note-taking-in-obsidian/

[^6]: https://developer.hashicorp.com/vault/docs/commands/kv/metadata

[^7]: https://platform.veevavault.help/en/gr/15298/

[^8]: https://linkeddatatools.com/knowledge-vaults/

[^9]: https://learn.microsoft.com/en-us/answers/questions/2122410/can-we-get-search-option-on-keyvault-page-for-find

[^10]: https://community.cyberark.com/s/article/00004539

