## **Třístupňová architektura vaultů**
**Origin-Dev (Vývojový vault):**
- Hlavní vault pro experimentování a vývoj nových funkcí1
- Obsahuje `99-System/Development` složku pro tracking změn
- Používá `experiment` tagy pro nové funkce2
- Metadata: `status: development`, `version: dev-branch`3
**Origin-Test (Testovací vault):**
- Stabilizovaná verze pro testování před nasazením
- Obsahuje pouze ověřené změny z Dev
- Metadata: `status: testing`, `version: release-candidate`3
**Origin-Prod (Produkční šablona):**
- Finální, stabilní verze pro vytváření nových vaultů
- Verzování: `Origin v1.2.0`, `Origin v1.3.0`4
- Metadata: `status: production`, `version: stable`
---


![[OBS_vault_wf.png]]

Origin-Test-Production workflow pro správu Obsidian vaultů s vizualizací procesů testování a integrace změn![[OBS_test_vault_process.png]]

Diagram testovacích procesů a objevování vylepšení v Test vaultu s rozhodovacími body pro integraci změn
## Klíčové testovací aktivity v Test vaultu
**Feature Testing**: Testování nových funkcí a šablon implementovaných v Origin vaultu. Tento proces může odhalit problémy s kompatibilitou pluginů nebo nedostatky v dokumentaci[3](https://forum.obsidian.md/t/recommendations-for-a-backup-solution/93714).
**Workflow Testing**: Ověření efektivity navržených procesů v praxi. Zde můžete objevit úzká místa v workflow nebo příležitosti pro automatizaci[5](https://readmedium.com/how-to-backup-your-obsidian-vault-local-version-bc82aeb88d3b).
**Performance Testing**: Sledování výkonu vaultu při větším množství dat, což je kritické vzhledem k vašim 3000+ poznámkám[6](https://graphite.dev/guides/git-difftool).
**User Experience Testing**: Testování intuitivnosti systému z pohledu konečného uživatele
## Git-based tracking pro změny
**Využití Git diff pro analýzu změn:**
Porovnat změny s tím co původně vypadlo ze ZIP dané verze. 
---
## Aktuální Workflow Structure
## Denní Pracovní Tok
Váš systém využívá osvědčený **GTD-inspired workflow** s jasnou hierarchií:
**1. Capture Phase (Zachycení)**
- `Ctrl+Shift+I` - rychlé zachycení do `00-Inbox`
- Vše začíná s `#📥inbox` tagem
- Bez přemýšlení o organizaci - jen zachytit
**2. Process Phase (Zpracování)**
- Denní morning routine (10 minut)
- Rozhodovací strom: "Co to je? Actionable? 2 min?"
- Třídění do příslušných složek podle content type
**3. Organization Phase (Organizace)**
- `00-Inbox` → distribuce do `01-MOCs`, `02-Dots`, `03-Efforts`, `04-Sources`, `05-Journal`
- Aplikace statusových tagů: `#📥inbox` → `#🔄active` → `#✅completed` → `#📦archived`
- Auto Note Mover rules pro automatické přesuny podle tagů
## Verzovací Strategii & Deployment
## Origin → Test → Produkce Flow
**Origin Vault (Development)**1
- **Backup**: Obsidian Sync pro pohodlí
- **Účel**: Kontinuální vývoj a experimentování
- **Update**: Průběžně podle potřeb
**Test Vault (Staging)**
- **Backup**: Git (týdenní)
- **Proces**: ZIP export z Origin → rozbalení → `git init` → sledování změn
- **Účel**: Testování změn a identifikace vylepšení
**Feedback Loop Integration**
- Test vault objeví vylepšení → `git diff` analýza změn
- Manuální review a integrace zpět do Origin
- Dokumentace v `Changelog.md`5
## Metadata Schema & Chybějící Elementy
## Universal Metadata Structure
```
title: "Note title"
type: atomic|project|source|moc|meeting
status: 📥inbox|🔄active|⏳waiting|✅completed|📦archived
created: YYYY-MM-DD
modified: YYYY-MM-DD
priority: high|medium|low
energy: high|medium|low
maturity: 📤seed|🌱seedling|🪴sapling|🌲evergreen|🍓fruit
```
## Folder-Specific Metadata
Každá složka potřebuje specializovaná metadata:
```
**00-Inbox**: `capturemethod`, `processingpriority`, `estimatedeffort`  
**01-MOCs**: `coverageareas`, `lastreview`, `completeness`, `linkednotescount`  
**02-Dots**: `sourceinspiration`, `relatedconcepts`, `confidencelevel`  
**03-Efforts**: `projectstatus`, `deadline`, `completionpercentage`, `nextactions`  
**04-Sources**: `sourceurl`, `sourceauthor`, `readstatus`, `keyinsightscount`
```
## Co Vám Chybí k Implementaci
## 1. Dokumentace & Templates
- **Templater skripty** pro automatické vyplňování metadata podle folder typu
- **Specializované templates** pro každou složku s předvyplněnými YAML bloky
- **Git workflow documentation** pro Test vault management
## 2. Automatizace
- **Metadata validation skripty** pro kontrolu konzistence
- **Performance metrics tracking** pomocí Dataview queries
## 3. Procesy & Checklists
- **Integration review checklist** pro změny z Test vault
- **Rollback procedures** pro případ problémů
- **Version numbering system** pro sledování releases
## 4. Doporučené Okamžité Akce
**Týden 1 - Core Setup:**
- Vytvořit univerzální YAML template s Templater integrací
- Nastavit Auto Note Mover rules pro tag-based sorting
- Implementovat týdenní Git backup script pro Test vault
**Týden 2 - Automation:**
- Bulk update existujících poznámek s metadata
- Nastavit Dataview dashboardy pro performance tracking
- Vytvořit maintenance skripty pro cleanup
**Týden 3 - Process Integration:**
- Zdokumentovat change integration procedures
- Vytvořit review checklist pro Origin ← Test změny
- Implementovat changelog automation


Visualise

documentation-structure:
  readme: "Main vault documentation"
  changelog: "Version history and updates"
  start-here: "Installation and setup guide"
  workflow-guide: "Usage instructions"
documentation-status: "active"
maintenance-schedule: "weekly"

# MaybE? 
## **Change Tracking Schema**
change-categories:
  - "added"
  - "changed" 
  - "deprecated"
  - "removed"
  - "fixed"
  - "security"
priority-levels: ["critical", "major", "minor", "patch"]
impact-scope: ["system", "workflow", "templates", "plugins"]

## **Configuration Status**
would be better in checklist right? 
```
setup-checklist:
  plugins-installed: false
  templates-configured: false
  folder-structure-created: false
  automation-rules-set: false
  sync-configured: false
required-knowledge-level: "beginner"
troubleshooting-available: true
```

---

# Proces visualised
---
Na základě analýzy vašich současných postupů a best practices pro PKM systémy navrhuji integrované řešení tří propojených procesů, které nahradí fragmentované řízení v README a Changelog[1](https://www.aha.io/roadmapping/guide/roadmap/best-practices)[2](https://www.productplan.com/learn/successful-product-roadmaps/). Navržený systém odděluje různé typy změn podle jejich povahy a zavádí strukturované workflow s Git-based verzování

![[OBS_vault_lifecycle.png]]
Celkový systémový přehled Origin Vault Management workflow


Celkový systém se skládá ze tří hlavních procesů: **Intake & Prioritization** pro kategorizaci všech změn, **Development & Testing** pro bezpečné testování v Git prostředí, a **Release & Deployment** pro kontrolované vydávání nových verzí[9](https://www.shakebugs.com/blog/issue-tracking-workflow/)[10](https://www.enov8.com/blog/what-is-release-management-in-itil-guide-and-best-practices/).

## PROCES 1: Intake & Prioritization (Příjem a Prioritizace)

Tento proces řeší fragmentaci mezi Changelog a README roadmapou zavedením **jednotného vstupního bodu** s okamžitou kategorizací[1](https://www.aha.io/roadmapping/guide/roadmap/best-practices)[11](https://www.nuclino.com/solutions/issue-tracking-software). Každá změna je automaticky směrována do správného dokumentu podle své povahy a priority[7](https://www.pmi.org/disciplined-agile/agile/backlogmanagement).

## Kategorizace změn

**Drobné změny** (typu založení souborů, malé opravy) se zapisují přímo do `Changelog.md` se statusem "completed"[12](https://www.touchpoint.com/blog/changelog-examples/). **Návrhy zlepšení** (nové funkce, experimenty) směřují do nového `Backlog.md` se statusem "proposed"[13](https://contentsquare.com/guides/product-management/backlog/). **Funkční procesy** (změny workflow, nové struktury) se plánují v `README.md` Roadmap sekci se statusem "planned"[6](https://thoughtbot.com/blog/product-roadmap-best-practices).

![[OBS_vault_wf_dev.png]]
Kanban-style workflow pro Origin vault management


## Metadata standardy - ADVANCED 

Každý typ změny má definovanou metadata strukturu zajišťující konzistentní sledování a prioritizaci[14](https://www.secoda.co/glossary/what-are-metadata-standards). Backlog položky obsahují campos jako priority, estimated-effort, target-version a dependencies[13](https://contentsquare.com/guides/product-management/backlog/). README roadmapa sleduje plánované, probíhající a dokončené aktivity v aktuální verzi


## PROCES 2: Development & Testing (Vývoj a Testování)

Tento proces zavádí **Git-based testovací prostředí** pro bezpečné experimentování bez rizika poškození Origin vaultu[3](https://daily.dev/blog/documentation-version-control-best-practices-2024)[15](https://decoder.ow2.io/pkm-api/public/Open%20source%20PKM%20server-side%20software/4/index.html). Test vault se vytváří týdně jako ZIP export s následnou Git inicializací pro sledování všech změn[4](https://en.wikipedia.org/wiki/Software_versioning).

## Testovací workflow

Schválené položky z Backlog se přesouvají do README "In Progress" sekce[7](https://www.pmi.org/disciplined-agile/agile/backlogmanagement). Implementace probíhá v Origin vaultu, následuje ZIP export do Test vault prostředí[16](https://help.obsidian.md/manage-vaults). Git tracking umožňuje detailní analýzu všech modifikací pomocí `git diff` příkazů[3](https://daily.dev/blog/documentation-version-control-best-practices-2024).

![[Pasted image 20250625164132.png]]
Kompletní workflow pro Origin vault management - tři integrované procesy


## Change tracking

Denní automatické commits zachycují všechny testovací iterace[3](https://daily.dev/blog/documentation-version-control-best-practices-2024). Git diff analýza poskytuje přesný přehled změn pro následnou integraci do Origin vaultu[4](https://en.wikipedia.org/wiki/Software_versioning). Test dokumentační template standardizuje reporting výsledků testování[9](https://www.shakebugs.com/blog/issue-tracking-workflow/).

## PROCES 3: Release & Deployment (Vydání a Nasazení)

Finální proces zajišťuje **kontrolovanou integraci** validovaných změn z Test vault zpět do Origin s plným verzováním[10](https://www.enov8.com/blog/what-is-release-management-in-itil-guide-and-best-practices/). Manuální review Git diff výstupů garantuje kvalitu a bezpečnost integrace[3](https://daily.dev/blog/documentation-version-control-best-practices-2024).

## Integration workflow

Pre-integration checklist zajišťuje kompletní přípravu včetně backup procedur[10](https://www.enov8.com/blog/what-is-release-management-in-itil-guide-and-best-practices/). Selective file integration kopíruje pouze validované změny[3](https://daily.dev/blog/documentation-version-control-best-practices-2024). Metadata updates zahrnují VERSION.md, README.md a Changelog.md aktualizace[4](https://en.wikipedia.org/wiki/Software_versioning)[14](https://www.secoda.co/glossary/what-are-metadata-standards).

![[OBS_metadataflow.png]]
Metadata Flow Diagram pro Origin vault management

## Deployment standardy

Nová verze je exportována jako ZIP s verzovým označením pro distribuci do production vaultů[4](https://en.wikipedia.org/wiki/Software_versioning). Semantic versioning (Major.Minor.Patch) poskytuje jasnou kompatibilní informaci[4](https://en.wikipedia.org/wiki/Software_versioning). Changelog entries dokumentují source, modified files a testing duration[12](https://www.touchpoint.com/blog/changelog-examples/).

## Implementační doporučení

## Týdenní cyklus

Doporučuji **týdenní release cyklus** s jasně definovanými milníky[2](https://www.productplan.com/learn/successful-product-roadmaps/)[10](https://www.enov8.com/blog/what-is-release-management-in-itil-guide-and-best-practices/). Week 1-2 pro development v Test vault, Week 3 pro integration review, Week 4 pro release a deployment[8](https://www.smartsheet.com/content/agile-workflows). Tento rytmus zajišťuje pravidelný progress při zachování stability[6](https://thoughtbot.com/blog/product-roadmap-best-practices).

## Monitoring metriky

Weekly review points sledují backlog health, test vault effectiveness a integration efficiency[13](https://contentsquare.com/guides/product-management/backlog/). Monthly assessment zahrnuje process adherence rate, version cycle performance a stakeholder satisfaction[10](https://www.enov8.com/blog/what-is-release-management-in-itil-guide-and-best-practices/). Tyto metriky poskytují data pro kontinuální optimalizaci procesů[8](https://www.smartsheet.com/content/agile-workflows).
