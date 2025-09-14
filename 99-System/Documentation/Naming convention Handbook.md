⬆️:: [[My PKM Workflows - Global Guidelines]]
[[My PKM Folders]]
[[Naming Emotified]]
## Executive Summary
A consistent naming convention is one of the simplest, highest-leverage ways to speed up search, reduce duplication, and align teams. This handbook distils proven patterns—ranging from date stamps and project codes to knowledge-management taxonomies—into short, actionable reference cards. For each convention you’ll find syntax, best-fit scenarios, pros/cons, and real-world examples. Decision aids at the end offer a quick comparison table and an ASCII flowchart for fast selection. Copy, adapt, and enforce the practices that match your workflows.

---
## 1. ISO 8601 Date-Based Naming
### Definition & Syntax
`YYYY-MM-DD_descriptor` (e.g., `2025-07-18_Meeting-Notes.md`). Variants: `YYYYMMDD`, `YYYY-MM`, `YYYY`.
### Primary Use-Cases
Chronological logs, daily/weekly notes, assets where the creation date is the key retrieval handle.
### Benefits & Trade-Offs
- **✓ Sorts naturally** across systems
- **✓ Eliminates US vs. EU day/month confusion**
- **✗ Adds length** if date is irrelevant
- **✗ Less meaningful for evergreen docs**
### Worked Examples
- Folder: `2025-07-18/notes/`
- File: `2025-07-18_Project-Kickoff.mp4`
- Note: `2025-07-W29_Sprint-Retro.md`
### Related Conventions / Variations
[Information Blocks](#2-information-block-naming) • [Version Suffixes](#3-version--status-suffixing)
---
## 2. Information Block Naming
### Definition & Syntax
`[Project]_[DocType]_[YYYY-MM-DD]_[v##]_[Author].ext`  
E.g., `ApolloCRM_Report_2025-03-15_v02_JSmith.pdf`
### Primary Use-Cases
Cross-functional projects needing quick visibility into document purpose, date, version, and owner.
### Benefits & Trade-Offs
- **✓ Self-documenting**; no metadata viewer required
- **✓ Scales to thousands of files**
- **✗ Longer filenames** may hit path limits
- **✗ Requires team discipline**
### Worked Examples
- `Marketing_Website_2025-01-10_v01_ALiu.fig`
- `IT_Policy_2025-02-28_v03_BSec.docx`
### Related Conventions / Variations
[ISO 8601 Date](#1-iso-8601-date-based-naming) • [Version Suffixes](#3-version--status-suffixing)
---
## 3. Version & Status Suffixing
### Definition & Syntax
Append one or both of:
- **Version:** `v01`, `v02`, …
- **Status:** `DRAFT`, `REVIEW`, `FINAL`  
    E.g., `Proposal_v03_REVIEW.docx`
### Primary Use-Cases
Creative assets, proposals, technical docs that evolve through fixed review stages.
### Benefits & Trade-Offs
- **✓ Linear history** without overwriting
- **✓ Works on any OS** (no Git needed)
- **✗ Can balloon** into many duplicates
- **✗ Manual bumping** invites human error
### Worked Examples
1. `BrandGuide_v01_DRAFT.pdf` → `BrandGuide_v02_REVIEW.pdf` → `BrandGuide_v03_FINAL.pdf`
2. `API_Spec_v05.docx`
### Related Conventions / Variations
[Information Block](#2-information-block-naming)
---
## 4. Topic-Based Hierarchical Note Naming
### Definition & Syntax
`Domain/Topic/Subtopic/Note-Title.md` plus time buckets for journals (`YYYY-MM-DD.md`).
### Primary Use-Cases
Second-brain or team knowledge bases where subject matter outranks chronology.
### Benefits & Trade-Offs
- **✓ Mirrors mental models**
- **✓ Infinite drill-down**
- **✗ Deep nesting** may hide notes
- **✗ Renaming a folder** breaks links
### Worked Examples
- `Research/AI/LLM/Vector-Databases.md`
- `Journals/2025-07-18.md`
### Related Conventions / Variations
[PARA](#8-para-folder-classification) • [Zettelkasten](#5-zettelkasten-uid-naming)
---
## 5. Zettelkasten UID Naming
### Definition & Syntax
`UID Descriptive-Title` where UID is a timestamp or random hash (`202507181230_Rectangular-Vectors.md`).
### Primary Use-Cases
Atomic, densely linked notes—personal knowledge systems, academic research.
### Benefits & Trade-Offs
- **✓ Globally unique**; no collisions
- **✓ Encourages evergreen notes**
- **✗ UID unreadable** at a glance
- **✗ Requires index or backlinks**
### Worked Examples
- `202507181230_Vector-Similarity.md`
- `20250718ZB5_Latent-Space-Explainers.md`
### Related Conventions / Variations
[Prepend Tags](#6-prepend-tag-naming) • [Topic Hierarchy](#4-topic-based-hierarchical-note-naming)
---
## 6. Prepend Tag Naming
### Definition & Syntax
`tag:Title` (e.g., `meetx:Q3-Roadmap`) using short prefixes (`meetx`, `idea`, `book`).
### Primary Use-Cases
Quick capture where note type (meeting, idea) matters more than project.
### Benefits & Trade-Offs
- **✓ Rapid scanning** in flat lists
- **✓ Works with tag filters** in many apps
- **✗ Over-tagging** = confusion
- **✗ No built-in versioning**
### Worked Examples
- `idea:Offline-First-Sync.md`
- `book:Clear-Thinking-Notes.md`
### Related Conventions / Variations
[Zettelkasten](#5-zettelkasten-uid-naming)
---
## 7. Johnny Decimal System
### Definition & Syntax
Two-level numeric code `##.## Topic` limiting folders to 10 per level (e.g., `10.04 Brand-Assets`).
### Primary Use-Cases
Department-wide shared drives that sprawl unless capped.
### Benefits & Trade-Offs
- **✓ Forces discipline**; prevents deep trees
- **✓ Codes are memorable**
- **✗ Initial setup** requires planning
- **✗ Numbers conceal meaning without index**
### Worked Examples
```
10 Projects
   10.04 Brand-Assets
20 Resources
   20.01 Style-Guides
```
### Related Conventions / Variations
[PARA](#8-para-folder-classification)
---
## 8. PARA Folder Classification
### Definition & Syntax
Top-level buckets: **Projects / Areas / Resources / Archives**.
### Primary Use-Cases
Personal productivity systems (Building a Second Brain), lightweight team spaces.
### Benefits & Trade-Offs
- **✓ Zero learning curve**
- **✓ Works across apps** (files, notes, tasks)
- **✗ Four buckets may be too coarse**
- **✗ Ambiguous edge cases** (Area vs. Resource)
### Worked Examples
```
/Projects/Website-Refresh/
/Areas/Marketing-Ops/
/Resources/LLM-Whitepapers/
/Archives/2024-Completed/
```
### Related Conventions / Variations
[Johnny Decimal](#7-johnny-decimal-system) • [Topic Hierarchy](#4-topic-based-hierarchical-note-naming)
---
## 9. Programming Case Styles
### Definition & Syntax
|Style|Syntax|Example|
|---|---|---|
|**camelCase**|first word lower, next capped|`getUserData`|
|**PascalCase**|every word capped|`UserDataProcessor`|
|**snake_case**|all lower, underscores|`user_data_processor`|
|**kebab-case**|all lower, hyphens|`user-data-processor`|
### Primary Use-Cases
Codebases, configs, APIs—controlled by language or framework norms.
### Benefits & Trade-Offs
- **✓ Conventions well-documented**
- **✓ Linting tools enforce**
- **✗ Mixed styles** confuse maintainers
- **✗ Some styles illegal** in certain contexts (kebab-case in JS variables)
### Worked Examples
- Python variable: `max_tokens` (snake)
- React component: `UserCard` (Pascal)
- CSS class: `btn-primary` (kebab)
### Related Conventions / Variations
[Information Block](#2-information-block-naming) for directory naming
---
## 10. Creative Project Folder Schema
### Definition & Syntax
`ProjectName_YYYY-MM-DD/` ⇒ numbered subfolders `01_ProjectFiles/… 05_Exports/`.
### Primary Use-Cases
Video, design, audio projects needing predictable hand-off structure.
### Benefits & Trade-Offs
- **✓ Standard hand-offs** to vendors/clients
- **✓ Easier batch scripts** for renders
- **✗ Overkill** for simple one-offs
- **✗ Requires periodic clean-up**
### Worked Examples
```
WebsiteRedesign_2025-01-15/
├── 01_ProjectFiles/
├── 02_SourceFootage/
├── 03_Assets/
├── 04_Drafts/
└── 05_Exports/
    ├── 01_VersionsForReview/
    ├── 02_Deliverables/
    └── 03_Masters/
```
### Related Conventions / Variations
[Version Suffixes](#3-version--status-suffixing)
---
## 11. Digital Asset Naming Pattern
### Definition & Syntax
`[Brand]_[Type]_[Description]_[Usage]_[YYYY-MM-DD]_[v##].ext`  
E.g., `Acme_PNG_Logo_Main_Web_2025-01-15_v01.png`
### Primary Use-Cases
Marketing libraries, DAM systems, social-media collateral.
### Benefits & Trade-Offs
- **✓ Keyword-rich** for search engines & humans
- **✓ Scales across brands & channels**
- **✗ Lengthy names** in bulk exports
- **✗ Needs tight abbreviation rules**
### Worked Examples
- `Acme_JPG_ProductShot_BlackPhone_Catalog_2025-01-10_v02.jpg`
- DAM path: `brand/acme/2025/01/`
### Related Conventions / Variations
[Creative Folder Schema](#10-creative-project-folder-schema)
---
## 12. IT Hardware Asset IDs
### Definition & Syntax
`[Co]-[Loc]-[Dept]-[YY]-[###]`  
E.g., `PG-NY-IT-25-001`
### Primary Use-Cases
On-prem equipment, barcode labels, CMDB inventories.
### Benefits & Trade-Offs
- **✓ Encodes location & year** at a glance
- **✓ Sequential ID simplifies audits**
- **✗ Relocation** breaks location code
- **✗ Non-IT staff may misinterpret**
### Worked Examples
- `AC-LA-HR-25-015` (Acme, LA, HR, 2025, device 15)
### Related Conventions / Variations
[Software Module Naming](#13-software-moduleresource-naming)
---
## 13. Software Module/Resource Naming
### Definition & Syntax
`Function_Type_v#.#_Environment`  
E.g., `UserAuth_Module_v2.1_Production`
### Primary Use-Cases
Scripts, micro-services, cloud resources where environment (dev/test/prod) is critical.
### Benefits & Trade-Offs
- **✓ Immediate clarity** on deploy target
- **✓ Works with CI/CD filters**
- **✗ Lacks date context** unless combined
- **✗ Long names in IaC templates**
### Worked Examples
- `DataBackup_Script_v1.5_Development`
- `Payments_API_v3.0_Staging`
### Related Conventions / Variations
[Version Suffixes](#3-version--status-suffixing)
---
## 14. Research Data File Naming
### Definition & Syntax
`YYYYMMDD_ShortDesc_Location_SampleID_Method_v##.ext`  
E.g., `20250718_Pollution_NYC_S12_GCMS_v01.csv`
### Primary Use-Cases
Lab datasets, field studies, reproducible science.
### Benefits & Trade-Offs
- **✓ High traceability** for audits
- **✓ Works well with ELNs & RDM tools**
- **✗ Filename can hit 255-char cap**
- **✗ Needs controlled vocab**
### Worked Examples
- `20250430_Soil_CN_Berlin_S05_IR_v02.xlsx`
### Related Conventions / Variations
[Academic Paper Naming](#15-academic-paper-file-naming)
---
## 15. Academic Paper File Naming
### Definition & Syntax
`Author_Year_Title_Status_v##.ext`  
E.g., `Smith_2025_LLM_Alignment_Draft_v01.docx`
### Primary Use-Cases
Manuscripts, conference submissions, grant proposals.
### Benefits & Trade-Offs
- **✓ Combines citation & workflow**
- **✓ Compatible with Zotero/EndNote**
- **✗ Multiple authors** inflate length
- **✗ Title changes require rename**
### Worked Examples
- `Johnson_2025_ClimateChange_Final_v03.pdf`
### Related Conventions / Variations
[Research Data Naming](#14-research-data-file-naming)

---
## Decision Aids
### A. Comparison Table
|#|Convention|Best For|Highlights|Watch-outs|
|---|---|---|---|---|
|1|ISO 8601 Date|Logs, daily notes|Natural sort|Adds length|
|2|Information Blocks|Multi-team projects|Self-documenting|Requires discipline|
|3|Version Suffixes|Iterative docs|Linear history|Duplicate sprawl|
|4|Topic Hierarchy|Knowledge bases|Mirrors domains|Deep nesting|
|5|Zettelkasten UID|Atomic notes|Unique IDs|Opaque strings|
|6|Prepend Tags|Quick capture|Fast scan|Tag creep|
|7|Johnny Decimal|Shared drives|Limits breadth|Needs index|
|8|PARA|Personal systems|Zero learning curve|Coarse buckets|
|9|Case Styles|Code|Lint support|Mixed styles|
|10|Creative Schema|Media projects|Standard hand-off|Overkill small jobs|
|11|Digital Asset|Marketing|Keyword-rich|Lengthy|
|12|HW Asset IDs|Physical devices|Location encoded|Relocation pain|
|13|Module Names|Cloud scripts|Env in name|No date|
|14|Research Data|Lab files|Audit trace|Very long|
|15|Academic Paper|Manuscripts|Citation-friendly|Title drift|
### B. Quick Selection Flowchart
```
START
  |
  |-- Is the item source code? ---- YES --> Use Programming Case Styles (#9)
  |                                   NO
  |-- Is it a physical IT asset? --- YES --> Use HW Asset IDs (#12)
  |                                   NO
  |-- Is it marketing or media? ---- YES --> Digital Asset (#11) OR Creative Schema (#10)
  |                                   NO
  |-- Is date the key handle? ------ YES --> ISO 8601 Date (#1)
  |                                   NO
  |-- Is it a knowledge note? ------ YES --> Topic Hierarchy (#4) / Zettelkasten UID (#5) / Prepend Tags (#6)
  |                                   NO
  |-- Is it a project document? ---- YES --> Information Blocks (#2) + Version Suffixes (#3)
  |                                   NO
  |-- Research/Academic? ---------- YES --> Research Data (#14) or Academic Paper (#15)
  |                                   NO
  |-- Default: Apply PARA (#8) for folder placement and descriptive filename within.
END
```
---
## Further Reading & Resources
- ISO 8601 Standard (ISO 8601-1:2019)
- Tiago Forte, _Building a Second Brain_ (PARA Method)
- Johnny.Decimal.com documentation
- Niklas Luhmann, _Zettelkasten_ principles
- NIST SP 1800-23, _Hardware Asset Management_