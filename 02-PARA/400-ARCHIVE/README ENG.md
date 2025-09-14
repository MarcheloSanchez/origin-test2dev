⬆️:: [[🏡Home]]
<div align="center">
<a href="https://discord.gg/veuWUTm">
  <img src="https://img.shields.io/discord/686053708261228577?color=%234E5D94%20&label=Obsidian Discord Server&logo=Discord&logoColor=white">
</a>
<a href="https://www.reddit.com/r/ObsidianMD/">
  <img src="https://img.shields.io/reddit/subreddit-subscribers/obsidianmd?label=r%2Fobsidianmd&logo=reddit&logoColor=white&?link=https://www.reddit.com/r/ObsidianMD/">
</a>
<a href="https://forum.obsidian.md/">
  <img src="https://img.shields.io/badge/Obsidian Forum-Discuss-%238471DA">
</a>

</div>

---
# Index

- [[README#Index|Index]]
- [[README#Co je Obsidian?|Co je Obsidian?]]
- [[README#Popis Origin|Co je Origin?]]
- [[README#🗂️ Struktura|🗂️ Struktura]]
- [[README#🛠️ Použití|🛠️ Použití]]
- [[README#📜 Principy|📜 Principy]]
- [[README#🔄 Workflow – jak se Vault používá|🔄 Workflow – jak se Vault používá]]
- [[README#🧩 Pluginy a nástroje (doporučené)|🧩 Pluginy a nástroje (doporučené)]]
- [[README#🚀 Roadmapa Vaultu|🚀 Roadmapa Vaultu]]
	- [[README#✅ Hotové|✅ Hotové]]
	- [[README#🛠 V procesu|🛠 V procesu]]
	- [[README#📌 Plánované|📌 Plánované]]
- [[README#FAQ|FAQ]]
- [[💾Changelog]]
---

![[Hero-journey-photo.png]]
# Co je Obsidian?

**Lidský mozek není lineární: neustále skáčeme z myšlenky na myšlenku. Druhý mozek by měl fungovat stejně.**
**V Obsidianu je vytváření a sledování propojení přirozené. Pečujte o poznámky jako zahradník; a večer se dívejte na svůj graf znalostí.**

---
# Co je Origin?

*Central "Meta Vault"** acting as the **template** for all other Obsidian vaults.
**Purpose**: Standardize shared elements (plugins, settings, templates, folder structure) across vaults.

---
## 🗂️ Struktura

| Složka       | Obsah                                                                                                                                                                           |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `00 Inbox`   | Vstupní brána pro vše nové. Rychlé poznámky, nápady, úkoly, které ještě nebyly zpracovány nebo zařazeny.                                                                        |
| `01 MOCs`    | Rozcestníky a navigace napříč tématy a složkami                                                                                                                                 |
| `02 Dots`    | Složka pro všechny „*kousky znalostí*“ – základní stavební jednotky tvého myšlení.                                                                                              |
| `03 Efforts` | Složka pro všechny tvé tvůrčí, rozpracované či rozvíjející se aktivity. Jakýkoli rozvoj, iniciativa, experiment, který nemusí mít jasný začátek/konec jako projekt.             |
| `04 Sources` | Složka pro všechny zdroje informací.                                                                                                                                            |
| `05 Journal` | (Volitelné, dle workflow) Denní/týdenní/měsíční záznamy, reflexe, zkušenosti.                                                                                                   |
| `06 Archive` | Složka pro zastaralé, dokončené, osobní nebo citlivé údaje a poznámky. Umožňuje zrychlení a ochranu, tím, že se tato složka zadává do vylučovacího listu, tedy nejde vyhledat.  |
| `99 System`  | Vše, co definuje pravidla a procesy Meta Vaultu. Systémové soubory, checklisty, rutiny, pluginy, nastavení, hotkeys, workflow.                                                  |

---
## 🛠️ Použití

- Kopíruj obsah podle potřeby do ostatních vaultů.
- Používej jako referenční dokumentaci při nastavování nových prostředí.
- Pokud pracuješ ve více vaultech, synchronizuj přes GIT/submodules/symlink (volitelně).

---
## 📜 Principy

- *Jasnost před chytrostí* – každý soubor má jasný název a účel.
- *Reusability* – poznámky a šablony jsou přenositelné.
- *Minimalismus* – držet jen to, co má skutečný dopad na produktivitu a myšlení.

---
## 🔄 Workflow – jak se Vault používá

## Klíčové principy úspěchu
- Managing my PKM system - [[My PKM MOC]]
	- [[My PKM Folders]]
	- [[My PKM Tags]]
	- [[My PKM Metadata]]
	- [[My PKM Queries]]
- Managing my PKM workflows ♽
	- *What are my "best practice" workflows for processing the world of ideas?*
	- [[My PKM Workflows - Global Guidelines]]
		- [[Obsidian Plugins & Features]]
		- [[Hotkeys & Automation]]
		- [[Vyhledávání plugin porovnání]]

### Process-Capture-Workflow

- **Sync Process**:
    - Update configurations in the Meta Vault.
    - Propagate changes to other vaults by **copying the `.obsidian` folder** (which stores settings/plugins).
FreeFileSync (Windows) to push _only changed files_ in `.obsidian`.

#### ✅ What **is** stored in `.obsidian/` and will be cloned:
- **Plugin configurations** (for both core and community plugins)
- **Workspace settings** (pane layouts, view states)
- **Hotkeys and UI settings**
- **Theme selection**
- **Enabled plugin list**

- **Safeguard**: Each vault maintains a **ChangeLog** to track local customizations, ensuring updates don’t override unique content.

---
## 🧩 Pluginy a nástroje (doporučené)

## Doporučení pro implementaci:
**Phase 1 (Meta Vault setup):**
- Essential + Obsidian Git + Hotkey Helper
**Phase 2 (Standard workflow):**
- Přidat Recommended podle potřeby jednotlivých vaultů
**Phase 3 (Advanced features):**
- Analytics & Maintenance pro velké vaulty
- Advanced Automation podle specialized use cases
**Maintenance strategy:**
- Plugin Update Tracker pro sledování změn
- Pravidelná synchronizace plugin listu mezi vaulty
- Dokumentace customizací v Changelog

## 🧩Plugin Classification
Na základě search results a tvých current pluginů:
## 🔴 Essential (Meta Vault core)
- **Templater** - Pokročilé šablony a skriptování
- **Dataview** - Dynamické dotazy a přehledy
- **Tasks** - Pokročilá správa úkolů
## 🟡 Recommended (Standard workflow)
- **QuickAdd** - Rychlé akce a makra
- **Periodic Notes** - Správa periodických poznámek
- **Commander** - Vlastní příkazy a zkratky
- **Advanced Tables** - Formátování tabulek
- **Metadata Menu** - Správa metadat
- **Omnisearch** - Globální vyhledávání
- **Quick Switcher++** - Vylepšený přepínač
- **Auto Note Mover** – Pravidla pro přesouvání poznámek dle tagu, regex, do nastavených složek.
## 🟢 Optional (Enhancement)
- **Advanced URI** - Parametrizované URL odkazy
- **Auto Link Title** - Automatické názvy odkazů
- **Plugin Update Tracker** - Přehled aktualizací
- **Snippet Downloader** - Stylovací snippety
- **Style Settings** - Přizpůsobení vzhledu
- **Text Format** - Rychlé formátování
- **Simple Embeds** - Snadné vkládání
## 🔵 Meta Vault Specific (Doporučené přidat)
- **Obsidian Git** - Verzování a backup Meta Vaultu
- **Hotkey Helper** - Správa a dokumentace hotkeys
- **Tag Wrangler** - Správa a cleanup tagů
- **Note Refactor** - Refaktoring poznámek
- **Linter** - Automatické formátování a cleanup
## 📊 Analytics & Maintenance (Pro velké vaulty)
- **Review** - Pravidelné revize poznámek
- **Database Folder** - Správa velkých datasetů
- **Smart Random Note** - Objevování starších poznámek
- **Workspaces** - Správa pracovních prostorů
## 🚀 Advanced Automation (Pokročilé)
- **Natural Language Dates** - Přirozené datumové výrazy
- **Calendar** - Vizuální kalendář a plánování
- **Kanban** - Projektové desky
- **Mind Map** - Myšlenkové mapy
- **Excalidraw** - Diagramy a sketche


## 🚀 Roadmapa Vaultu

_Prioritizovat_

---
### ✅ Hotové
viz v [[💾Changelog]]
### 🛠 V procesu
- Propojení s externími nástroji
### 📌 Plánované
- Automatická kategorizace nových poznámek
- MOC poznámky generované poloautomaticky přes Dataview
---
# FAQ 
❓ **Na co je tento Vault určen?**  

❓ **Mohu použít tvůj Vault jako šablonu?**  

❓ **Jaké pluginy jsou nutné?**  
A: Základní jádro zahrnuje Tasks, Dataview, Templater, QuickAdd...
❓ **Jak spravuji projekty?**  
A: PŘEPSAT: Pomocí Kanban nástěnek, tagů `project/…`, přehledů v Dataview.
❓ **Jak zaznamenávám myšlenky?**  
A: Pomocí šablon přes QuickAdd do složky `00 Inbox`, se strukturou pro propojení. 

---

_„Origin není vault na poznámky, je to vault na myšlení o poznámkách.“_