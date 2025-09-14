<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" class="logo" width="120"/>

# Links 

[[👤 Templater Guide]]

# Templater Handbook 2025

Kompletní průvodce pro efektivní použití Templater pluginu v Obsidian

Templater je výkonný community plugin pro Obsidian, který transformuje způsob, jakým vytváříte a spravujete šablony ve vašem vault. Na rozdíl od základního Templates pluginu poskytuje Templater pokročilé funkce včetně **JavaScript podpory, dynamických proměnných, uživatelských skriptů a automatizovaných triggerů**[^1]. Tento handbook vás provede od základních konceptů až po pokročilé techniky, které vám umožní vytvářet sofistikované, automatizované workflow pro správu znalostí v rámci projektu ORIGIN i dalších aplikací.

## 1. Úvod a základní koncepty

### 1.1 Co je Templater a proč ho používat

Templater je **template plugin pro Obsidian, který definuje templating jazyk umožňující vkládání proměnných a výsledků funkcí do poznámek**[^1]. Hlavní výhodou je možnost **spouštění JavaScript kódu pro manipulaci těchto proměnných a funkcí**[^1], což otevírá neomezené možnosti automatizace.

**Klíčové výhody Templater:**

- **Dynamické proměnné** - přizpůsobení obsahu podle kontextu
- **JavaScript integrace** - plná programovatelnost šablon
- **Uživatelské skripty** - rozšíření funkcionalite vlastními funkcemi
- **Automatizované triggery** - aplikace šablon bez manuálního zásahu
- **API integrace** - získávání dat z externích zdrojů


### 1.2 Rozdíly oproti core Templates pluginu

Hlavní rozdíl mezi core Templates a Templater je v **rozsahu automatizace a programovatelnosti**. Zatímco core Templates nabízí pouze základní funkce pro vkládání data a jednoduchých proměnných, Templater poskytuje **úplný templating engine s JavaScript podporou**[^2].

**Praktické dopady:**

- **Kontextově závislé šablony** - různé šablony pro různé složky nebo dny v týdnu
- **Automatické inkrementace** - automatické číslování instancí (např. "Session Log 100")
- **Integrace s dalšími pluginy** - čtení a zápis YAML frontmatter, spolupráce s Dataview
- **Vlastní skripty** - neomezená extensibilita pomocí JavaScript


## 2. Instalace a konfigurace

### 2.1 Instalace pluginu

**Krok za krokem instalace:**

1. **Otevřete Obsidian Settings** → Community Plugins
2. **Vyhledejte "Templater"** v prohlížeči pluginů
3. **Nainstalujte a aktivujte** plugin
4. **Přejděte do nastavení Templater** pro konfiguraci

### 2.2 Základní konfigurace

**Template folder location** je první kritické nastavení. Doporučuje se vytvořit dedikovanou složku pro šablony:

```
vault_root/
├── Templates/           # Hlavní složka pro šablony
│   ├── Daily/          # Denní poznámky
│   ├── Meeting/        # Šablony pro schůzky
│   ├── Project/        # Projektové šablony
│   └── Snippets/       # Malé återpoužitelné kousky
```

**Script folder location** (volitelné) pro pokročilé uživatele:

```
vault_root/
├── Scripts/            # JavaScript skripty
│   ├── helpers.js      # Pomocné funkce
│   ├── api-calls.js    # Externí API volání
│   └── automation.js   # Automatizační skripty
```

**Důležitá nastavení:**

- **Trigger Templater on new file creation** - automaticky aplikuje šablony
- **Enable folder templates** - různé šablony pro různé složky
- **Startup templates** - šablony spouštěné při startu Obsidian

![Workflow implementace Templater - čas a složitost jednotlivých kroků](https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/7fdb10eafdff9b21b826d8a38773b2a8/ea70cfb8-fe18-405e-bb0b-5d9502f9754b/d5d3a20e.png)

Workflow implementace Templater - čas a složitost jednotlivých kroků

## 3. Základní použití a syntaxe

### 3.1 Templater syntaxe

Templater používá **speciální tagy ohraničené znaky `<% %>`** pro označení dynamického obsahu[^3]. Existují dva hlavní typy tagů:

**Interpolace tagy** - vkládají hodnotu:

```
<% tp.date.now() %>                    // Výstup: 2025-07-12
<% tp.file.title %>                    // Výstup: Název souboru
```

**Execution tagy** - spouštějí kód bez výstupu:

```
<%* 
let title = await tp.system.prompt("Enter title");
await tp.file.rename(title);
%>
```


### 3.2 Aktivace šablon

**Tři způsoby aplikace šablon:**

1. **Command Palette** → "Templater: Replace templates in the active file"
2. **Hotkey** (doporučeno nastavit na Alt+R)
3. **Automatické triggery** při vytvoření nového souboru

## 4. API Reference a základní funkce

Templater API je organizováno do logických kategorií, každá s specifickými funkcemi pro různé účely.

### 4.1 tp.file funkce

**Práce se soubory a jejich metadaty:**

```javascript
<% tp.file.creation_date("YYYY-MM-DD HH:mm") %>     // 2025-07-12 00:42
<% tp.file.last_modified_date("dddd Do MMMM YYYY") %> // Saturday 12th July 2025
<% tp.file.title %>                                  // Název bez přípony
<% tp.file.path() %>                                 // Relativní cesta
```

**Pokročilé file operace:**

```javascript
// Vložení obsahu jiné šablony
<% tp.file.include("[[Daily Template]]") %>

// Získání obsahu současného souboru
<% tp.file.content %>

// Vytvoření nového souboru
<%* await tp.file.create_new("New Note", "Note content") %>
```


### 4.2 tp.date funkce

**Manipulace s daty používá Moment.js formátování:**

```javascript
<% tp.date.now("YYYY-MM-DD") %>          // 2025-07-12
<% tp.date.yesterday("dddd") %>          // Friday  
<% tp.date.tomorrow("MMMM Do") %>        // July 13th
<% tp.date.weekday("YYYY-MM-DD", 1) %>   // Příští pondělí
```


### 4.3 tp.system funkce

**Interakce s uživatelem a systémem:**

```javascript
// Výzva k zadání textu
<%* const projectName = await tp.system.prompt("Project name") %>

// Výběr z možností
<%* const priority = await tp.system.suggester(
    ["High", "Medium", "Low"], 
    ["🔴", "🟡", "🟢"]
) %>

// Obsah schránky
<% tp.system.clipboard() %>
```


### 4.4 tp.web funkce

**Získávání obsahu z internetu:**

```javascript
<% tp.web.daily_quote() %>          // Denní citát
<% tp.web.random_picture() %>       // Náhodný obrázek
```

**Varování:** tp.web funkce vyžadují internetové připojení a mohou selhat při výpadku služeb[^4].

## 5. Pokročilé funkce a uživatelské skripty

### 5.1 Uživatelské skripty

**Uživatelské skripty umožňují vytváření vlastních funkcí v JavaScript**[^5]. Pro použití je nutné nastavit Script folder v nastavení Templater.

**Vytvoření uživatelského skriptu:**

1. **Vytvořte soubor `Scripts/weather.js`:**
```javascript
async function getCurrentWeather(city) {
    try {
        const response = await fetch(`https://wttr.in/${city}?format=2`);
        const weather = await response.text();
        return weather.trim();
    } catch (error) {
        return "Weather not available";
    }
}

module.exports = getCurrentWeather;
```

2. **Použití ve šabloně:**
```javascript
<% tp.user.weather("Prague") %>     // Výstup: 🌤 +22°C
```

**Pokročilé možnosti uživatelských skriptů:**

- **Přístup k Obsidian API** přes globální `app` objekt
- **Argumenty funkcí** - předávání parametrů včetně `tp` objektu
- **Asynchronní operace** pro externí API volání
- **Error handling** s try-catch bloky


### 5.2 Automatizace a triggery

**Folder templates** umožňují automatickou aplikaci různých šablon podle umístění souboru:

```
Settings → Templater → Folder Templates:
- Folder: "Projects" → Template: "Project Template"  
- Folder: "Daily" → Template: "Daily Note Template"
- Folder: "Meeting Notes" → Template: "Meeting Template"
```

**Startup templates** se spouštějí při startu Obsidian pro inicializaci workspace.

## 6. Best practices a optimalizace

Efektivní použití Templater vyžaduje dodržování osvědčených postupů pro organizaci, výkon a bezpečnost.

### 6.1 Organizace šablon

**Naming conventions:**

- Používejte prefixes pro kategorizaci: `Daily-`, `Project-`, `Meeting-`
- Konzistentní formát dat: `YYYY-MM-DD` pro univerzální kompatibilitu
- Deskriptivní názvy: `Project-Kickoff-Template` místo `Template1`

**Struktura složek:**

```
Templates/
├── Core/               # Základní šablony
│   ├── Daily.md
│   ├── Weekly.md
│   └── Project.md
├── Specialized/        # Specializované šablony
│   ├── Meeting-1on1.md
│   ├── Book-Review.md
│   └── Code-Review.md
└── Snippets/          # Malé opakované kusy
    ├── Header.md
    ├── Footer.md
    └── Metadata.md
```


### 6.2 Výkonová optimalizace

**Minimalizace tp.web volání:**

```javascript
// Špatně - opakované volání
<% tp.web.daily_quote() %>
<% tp.web.daily_quote() %>

// Správně - jednou a uložení
<%* const quote = await tp.web.daily_quote() %>
<% quote %>
<% quote %>
```

**Cachování náročných operací:**

```javascript
<%* 
// Uložení do dočasné proměnné
const expensiveData = await tp.user.complexCalculation();
%>
Result: <% expensiveData %>
```


### 6.3 Bezpečnostní opatření

**Validace user input:**

```javascript
<%* 
const projectName = await tp.system.prompt("Project name");
if (!projectName || projectName.trim().length === 0) {
    throw new Error("Project name is required");
}
// Sanitizace speciálních znaků
const safeName = projectName.replace(/[\\\/:"*?<>|]/g, "_");
%>
```

**Ochrana citlivých dat:**

- Nikdy neukládejte API klíče přímo v šablonách
- Používejte environment variables nebo external config soubory
- Omezte přístup ke Scripts složce

![Komplexnost implementace vs. užitečnost funkcí Templater](https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/7fdb10eafdff9b21b826d8a38773b2a8/21e6cbcb-006f-4035-96c0-d71365b95ec2/05a82557.png)

Komplexnost implementace vs. užitečnost funkcí Templater

## 7. Troubleshooting a řešení chyb

Při práci s Templater se můžete setkat s různými typy chyb. Systematický přístup k jejich řešení šetří čas a frustraci.

### 7.1 Nejčastější chyby a řešení

**"tp.user.function_name is not a function"**

- **Příčina:** Uživatelský skript neexistuje nebo není správně definován
- **Řešení:** Ověřte existenci `.js` souboru ve Scripts složce a správnost `module.exports`

**"Template parsing error, aborting"**

- **Příčina:** Syntaktická chyba v template syntaxi
- **Řešení:** Zkontrolujte páření `<% %>` tagů a správnost JavaScript syntaxe

**"File name cannot contain characters: \ / :"**

- **Příčina:** Neplatné znaky v názvu souboru generovaném šablonou
- **Řešení:** Sanitizujte uživatelský input a datum formáty


### 7.2 Debugging techniky

**Console logging:**

```javascript
<%* 
console.log("Debug: template started");
const result = await tp.system.prompt("Test");
console.log("User input:", result);
%>
```

**Error handling s try-catch:**

```javascript
<%* 
try {
    const data = await tp.web.daily_quote();
    tR += data;
} catch (error) {
    tR += "Quote not available: " + error.message;
}
%>
```

**Postupné testování:**

1. Testujte jednotlivé funkce izolovaně
2. Postupně přidávejte složitější logiku
3. Používejte jednoduché šablony pro debugging

### 7.3 Performance debugging

**Identifikace pomalých operací:**

```javascript
<%* 
const start = Date.now();
const result = await tp.user.slowFunction();
const duration = Date.now() - start;
console.log(`Operation took ${duration}ms`);
%>
```


## 8. Praktické příklady a use cases

### 8.1 Denní poznámky s navigací

```markdown
---
tags: daily-note
date: <% tp.date.now("YYYY-MM-DD") %>
---

# <% tp.date.now("dddd, MMMM Do YYYY") %>

[[<% tp.date.yesterday("YYYY-MM-DD") %>]] ← → [[<% tp.date.tomorrow("YYYY-MM-DD") %>]]

## Agenda
- [ ] 

## Notes


## Reflections

```


### 8.2 Projektová šablona s automatickým setup

```markdown
<%* 
const projectName = await tp.system.prompt("Project name");
const projectType = await tp.system.suggester(
    ["Development", "Research", "Planning"], 
    ["dev", "research", "planning"]
);
const startDate = tp.date.now("YYYY-MM-DD");

await tp.file.rename(`${projectName} - Project`);
%>

---
title: <% projectName %>
type: <% projectType %>
start_date: <% startDate %>
status: active
---

# <% projectName %>

## Overview
Type: <% projectType.charAt(0).toUpperCase() + projectType.slice(1) %>
Started: <% startDate %>

## Objectives
- [ ] 

## Resources
- 

## Progress Log
### <% startDate %>
- Project initiated
```


### 8.3 Meeting notes s účastníky

```markdown
<%* 
const meetingTitle = await tp.system.prompt("Meeting title");
const attendees = await tp.system.prompt("Attendees (comma separated)");
const attendeeList = attendees.split(",").map(name => `- ${name.trim()}`).join("\n");
%>

---
meeting: <% meetingTitle %>
date: <% tp.date.now("YYYY-MM-DD") %>
time: <% tp.date.now("HH:mm") %>
attendees: [<% attendees %>]
---

# <% meetingTitle %>
**Date:** <% tp.date.now("dddd, MMMM Do YYYY") %>
**Time:** <% tp.date.now("HH:mm") %>

## Attendees
<% attendeeList %>

## Agenda
1. 

## Notes


## Action Items
- [ ] 

## Next Meeting
Date: 
Time: 
```


### 8.4 Integrace s externími API

```javascript
// Scripts/github-issue.js
async function createGithubIssue(title, description) {
    const repoUrl = "https://api.github.com/repos/username/repo/issues";
    const token = "your-github-token"; // Ideálně z config souboru
    
    try {
        const response = await fetch(repoUrl, {
            method: 'POST',
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                body: description
            })
        });
        
        const issue = await response.json();
        return issue.html_url;
    } catch (error) {
        console.error('Failed to create GitHub issue:', error);
        return null;
    }
}

module.exports = createGithubIssue;
```

```markdown
<!-- Použití v šabloně -->
<%* 
const issueTitle = await tp.system.prompt("Issue title");
const issueDescription = await tp.system.prompt("Issue description");
const issueUrl = await tp.user.github_issue(issueTitle, issueDescription);
%>

# Issue: <% issueTitle %>

Description: <% issueDescription %>

<% if (issueUrl) { %>
GitHub Issue: <% issueUrl %>
<% } else { %>
⚠️ Failed to create GitHub issue
<% } %>
```


## 9. Integrace s dalšími pluginy

### 9.1 Dataview integrace

Templater může generovat Dataview queries dynamicky:

```markdown
<%* 
const projectTag = await tp.system.prompt("Project tag");
%>

# Project Dashboard: <% projectTag %>

## Recent Tasks
```

TABLE status, due
FROM \#<% projectTag %>
WHERE contains(file.name, "task")
SORT due ASC

```

## Progress Overview
```

LIST
FROM \#<% projectTag %>
WHERE status = "completed"

```
```


### 9.2 Calendar plugin integrace

Pro vytváření event-based poznámek:

```markdown
<%* 
const eventDate = await tp.system.prompt("Event date (YYYY-MM-DD)");
const eventTime = await tp.system.prompt("Event time (HH:mm)");
%>

---
event_date: <% eventDate %>
event_time: <% eventTime %>
calendar: true
---

# Event: <% eventDate %> at <% eventTime %>

## Details


## Participants


## Notes

```


## 10. Workflow optimalizace pro projekt ORIGIN

Pro projekt ORIGIN můžete vytvořit specializované šablony které podporují váš PKM workflow:

### 10.1 Knowledge vault entry template

```markdown
<%* 
const entryType = await tp.system.suggester(
    ["Concept", "Process", "Tool", "Resource"], 
    ["concept", "process", "tool", "resource"]
);
const sourceUrl = await tp.system.prompt("Source URL (optional)");
%>

---
entry_type: <% entryType %>
created: <% tp.file.creation_date("YYYY-MM-DD HH:mm") %>
source: <% sourceUrl || "internal" %>
tags: [origin, <% entryType %>]
---

# <% tp.file.title %>

## Summary


## Key Points
- 

## Connections
Related to: 

## Implementation Notes


<% if (sourceUrl) { %>
## Source
[Original Source](<% sourceUrl %>)
<% } %>
```


### 10.2 Feature development template

```markdown
<%* 
const featureName = await tp.system.prompt("Feature name");
const priority = await tp.system.suggester(
    ["Critical", "High", "Medium", "Low"], 
    ["🔴", "🟠", "🟡", "🟢"]
);
%>

---
feature: <% featureName %>
priority: <% priority %>
status: planning
created: <% tp.date.now("YYYY-MM-DD") %>
---

# Feature: <% featureName %>

**Priority:** <% priority %> **Status:** Planning

## Requirements
- [ ] 

## Technical Approach


## Implementation Plan
1. 

## Testing Strategy


## Documentation Notes

```


## Závěr

Templater představuje **výkonný nástroj pro automatizaci a systematizaci práce s poznámkami v Obsidian**. Jeho největší síla spočívá v **kombinaci jednoduchosti použití s neomezenými možnostmi rozšíření pomocí JavaScript**[^5].

**Klíčové takeaways:**

1. **Postupná implementace** - začněte základními funkcemi a postupně přidávejte složitější logiku
2. **Standardizace procesů** - používejte konzistentní naming conventions a struktury
3. **Automatizace rutinních úloh** - maximalizujte efektivitu pomocí triggerů a uživatelských skriptů
4. **Bezpečnost na prvním místě** - vždy validujte user input a chraňte citlivá data
5. **Kontinuální optimalizace** - pravidelně revidujte a vylepšujte své šablony

**Další kroky pro projekt ORIGIN:**

1. **Implementujte základní workflow** podle uvedených příkladů
2. **Vytvořte library uživatelských skriptů** pro často používané operace
3. **Nastavte automatizované triggery** pro konzistentní aplikaci šablon
4. **Integrujte s dalšími pluginy** (Dataview, Calendar) pro komplexní PKM systém
5. **Dokumentujte své custom řešení** pro budoucí reference a team collaboration

Templater není jen nástroj pro vytváření šablon - je to **foundation pro vytvoření plně automatizovaného, personalizovaného knowledge management systému**, který roste a přizpůsobuje se vašim potřebám v čase.

<div style="text-align: center">⁂</div>
# Sources

[^1]: https://github.com/SilentVoid13/Templater

[^2]: https://nicolevanderhoeven.com/blog/20220131-5-things-the-obsidian-templater-can-do-that-templates-cant/

[^3]: https://silentvoid13.github.io/Templater/introduction.html

[^4]: https://forum.obsidian.md/t/templater-error-handling/53627

[^5]: https://silentvoid13.github.io/Templater/user-functions/script-user-functions.html

[^6]: https://obsidianttrpgtutorials.com/Obsidian+TTRPG+Tutorials/Templates/Templates

[^7]: https://github.com/Veams/plugin-templater

[^8]: https://www.reddit.com/r/ObsidianMD/comments/sh37n0/obsidian_templates_vs_templater/

[^9]: https://github.com/Grubre/templater.nvim

[^10]: https://oscarmlage.com/posts/obsidian-templater-full-potential/

[^11]: https://help.obsidian.md/plugins/templates

[^12]: https://github.com/mihaiconstantin/obsidian-templater-scripts

[^13]: https://cassidoo.co/post/obsidian-templater/

[^14]: https://github.com/sylumer/obsidian-templater-converters

[^15]: https://www.youtube.com/watch?v=QpJbeP8f55A

[^16]: https://github.com/TfTHacker/obsidian-ai-templater

[^17]: https://obsidianttrpgtutorials.com/Obsidian+TTRPG+Tutorials/Plugin+Tutorials/Templater/Templater

[^18]: https://github.com/topics/templater

[^19]: https://forum.obsidian.md/t/templater-cheat-sheet/33518

[^20]: https://github.com/bridge-core/plugins/blob/master/plugins/Templater/README.md

[^21]: https://obsidian.md/plugins?search=templater

[^22]: https://www.obsidianstats.com/plugins/templater-obsidian

[^23]: https://zachyoung.dev/posts/templater-snippets/

[^24]: https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/templates/best-practices-for-templates

[^25]: https://forum.obsidian.md/t/issue-with-templater-api-calling-tp-file-i-think-but-not-tp-file-tags/71034

[^26]: https://pinjasaur.github.io/templater.js/

[^27]: https://swsphn.com.au/wp-content/uploads/2022/06/how-to-create-templates-in-best-practice.pdf

[^28]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals

[^29]: https://developer.harness.io/docs/platform/templates/templates-best-practices/

[^30]: https://www.reddit.com/r/ObsidianMD/comments/xtkh84/automate_the_creation_of_referenceliterature/

[^31]: https://forum.obsidian.md/t/help-needed-with-js-for-templater/57187

[^32]: https://help.benchling.com/hc/en-us/articles/15635136934541-Template-Best-Practices

[^33]: https://developer.zendesk.com/api-reference/help_center/help-center-templates/introduction/

[^34]: https://www.youtube.com/watch?v=9w_BQHH3ptY

[^35]: https://helpx.adobe.com/premiere-pro/using/bestpractices-projects.html

[^36]: http://www.macdrifter.com/2021/08/obsidian-templater-fun.html

[^37]: https://github.com/SilentVoid13/Templater/discussions/187

[^38]: https://www.reddit.com/r/ObsidianMD/comments/1evcd33/templates_or_templater_tips_tricks_must_haves/

[^39]: https://developers.google.com/tag-platform/tag-manager/templates/api

[^40]: https://nicolevanderhoeven.com/blog/20220116-how-to-use-dataview-and-templater-to-run-javascript-in-obsidian/

[^41]: https://obsidian-scripts.mihaiconstantin.com/docs/prompt.html

[^42]: https://www.calhoun.io/using-functions-inside-go-templates/

[^43]: https://www.dokuwiki.org/plugin:templater

[^44]: https://www.reddit.com/r/ObsidianMD/comments/1bw0egh/templater_tpfileinclude_call_function/

[^45]: https://www.reddit.com/r/ObsidianMD/comments/13znxcj/using_templater_and_templates_core_at_the_same/

[^46]: https://silentvoid13.github.io/Templater/user-functions/overview.html

[^47]: https://forum.obsidian.md/t/usage-of-templater-create-new-function/70227

[^48]: https://github.com/liamcain/obsidian-calendar-plugin/issues/189

[^49]: https://obsidian-scripts.mihaiconstantin.com/docs/makeNoteWithPrompting.html

[^50]: https://github.com/SilentVoid13/Templater/discussions/363

[^51]: https://forum.obsidian.md/t/nested-templates-utilizing-the-templater-plugin/26207

[^52]: https://forum.obsidian.md/t/user-scripts-in-templater/20504

[^53]: https://www.youtube.com/watch?v=91H_0ii4S-A

[^54]: https://support.dataclay.com/templater/content/how_to/production/troubleshooting_using_logging.htm

[^55]: https://support.dataclay.com/templater/content/how_to/cli/troubleshooting_the_templater_command_line_interface.htm?Highlight=error+code

[^56]: https://vinzent03.github.io/obsidian-advanced-uri/tips

[^57]: https://support.templafy.com/hc/en-us/articles/4404069951377-Troubleshooting-Validation-errors-when-uploading-a-document-in-the-Admin-Center

[^58]: https://www.youtube.com/watch?v=c6qfrRVUOO8

[^59]: https://www.reddit.com/r/ObsidianMD/comments/18rkg2k/error_with_the_templater_plugin/

[^60]: https://www.reddit.com/r/ObsidianMD/comments/11c0t9k/a_collection_of_templates/

[^61]: https://github.com/SilentVoid13/Templater/issues/724

[^62]: https://github.com/SilentVoid13/Templater/discussions/categories/templates-showcase

[^63]: https://www.smarty.net/docsv2/en/troubleshooting.tpl

[^64]: https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/7fdb10eafdff9b21b826d8a38773b2a8/cd5e0a40-1d69-412f-9dfd-075d41677f89/295556cd.csv

[^65]: https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/7fdb10eafdff9b21b826d8a38773b2a8/cd5e0a40-1d69-412f-9dfd-075d41677f89/4d2f4a75.csv

[^66]: https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/7fdb10eafdff9b21b826d8a38773b2a8/fedb53b2-26e3-4ca4-a920-fade0d64d839/05951b49.csv

[^67]: https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/7fdb10eafdff9b21b826d8a38773b2a8/fedb53b2-26e3-4ca4-a920-fade0d64d839/50fb9a63.csv

[^68]: https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/7fdb10eafdff9b21b826d8a38773b2a8/42902035-fb00-40a8-bbe6-ba6235cb8e09/d0e923e1.csv

