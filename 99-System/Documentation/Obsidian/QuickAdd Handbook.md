---
tags:
  - "#❤️"
Created:
---
⬆️:: [[🏡Home]]


QuickAdd představuje jeden z nejmocnějších pluginů pro Obsidian, který dramaticky rozšiřuje možnosti automatizace a rychlého zachycení poznámek [1](https://quickadd.obsidian.guide/docs/). Na rozdíl od Templateru, který se zaměřuje především na obsah šablon, QuickAdd poskytuje komplexní ekosystém pro celý proces vytváření, ukládání a manipulace s poznámkami


Plugin obsahuje čtyři základní typy voleb (choices), které společně vytvářejí flexibilní systém pro správu znalostí [1](https://quickadd.obsidian.guide/docs/)[3](https://quickadd.obsidian.guide/docs/Choices/MacroChoice):
- **Template Choice** - vytváření nových poznámek ze šablon
- **Capture Choice** - rychlé zachycení obsahu do existujících souborů
- **Macro Choice** - automatizace složitých workflow pomocí JavaScript kódu
- **Multi Choice** - organizace ostatních voleb do hierarchické struktury

## QuickAdd Architecture and PKM Integration Diagram
![[Pasted image 20250619113545.png]]

## 1. Základní nastavení a konfigurace

## 1.1 Instalace a první kroky

QuickAdd lze nainstalovat přímo z oficiálního repozitáře komunitních pluginů v Obsidianu [1](https://quickadd.obsidian.guide/docs/):
1. Otevřete nastavení Obsidianu → Komunitní pluginy → Procházet
2. Vyhledejte "QuickAdd" a klikněte na Instalovat
3. Po aktivaci pluginu klikněte na ikonu blesku v levém panelu nebo použijte příkaz "QuickAdd: Add Choice"
    

Abyste dosáhli maximální integrace s vaším PKM systémem, doporučuji následující počáteční nastavení
```
Settings → QuickAdd → Add Choice
```


## 1.2 Formát syntaxe a proměnné

QuickAdd využívá vlastní syntaxi proměnných podobnou Templateru, která však nabízí některé unikátní funkce [6](https://quickadd.obsidian.guide/docs/FormatSyntax):

|Proměnná|Popis|Příklad použití|
|---|---|---|
|`{{DATE}}`|Aktuální datum|`{{DATE}}` → 2025-06-19|
|`{{DATE:formát}}`|Formátované datum|`{{DATE:DD.MM.YYYY}}` → 19.06.2025|
|`{{VALUE}}`|Hodnota zadaná uživatelem|`Název: {{VALUE}}`|
|`{{VALUE:název}}`|Pojmenovaná proměnná|`Autor: {{VALUE:autor}}`|
|`{{VDATE:název,formát}}`|Datum s NLP podporou|`{{VDATE:termín,YYYY-MM-DD}}`|
|`{{LINKCURRENT}}`|Odkaz na aktuální soubor|`Odkaz: {{LINKCURRENT}}`|
Tyto proměnné můžete kombinovat pro vytvoření dynamických názvů souborů, obsahu šablon nebo textu pro zachycení

## 2. Template Choice - vytváření nových poznámek

## 2.1 Základní použití

Template Choice umožňuje vytvářet nové poznámky z předem definovaných šablon s podporou dynamických názvů [2](https://github.com/joshklein/obsidian-quickadd-plugin):

1. V nastavení QuickAdd vytvořte novou volbu typu "Template"
2. Nastavte cestu k šabloně (např. `99-System/Templates/projekt.md`)
3. Nastavte formát názvu (např. `{{DATE}} - {{VALUE}}`)
4. Vyberte cílovou složku (např. `03-Efforts`) [8](https://publish.obsidian.md/quickadd/Choices/TemplateChoice)
    

Příklad praktické konfigurace pro váš PKM systém:

- **Název volby**: Nový projekt
- **Šablona**: 99-System/Templates/projekt.md
- **Formát názvu**: {{DATE:YYYY-MM-DD}} - {{VALUE:název projektu}}
- **Cílová složka**: 03-Efforts/Active
    

## 2.2 Pokročilé možnosti

Template Choice nabízí několik pokročilých možností, které rozšiřují její funkčnost [8](https://publish.obsidian.md/quickadd/Choices/TemplateChoice):

- **Increment file name** - automatické přidání čísla k názvu souboru, pokud již existuje
- **Append link** - přidání odkazu na nově vytvořený soubor do aktuálně otevřeného souboru
- **Open** - automatické otevření nově vytvořeného souboru
- **Multiple folders** - možnost vybrat z několika složek při vytváření poznámky
    

## 2.3 Praktické příklady

**Šablona pro zachycení myšlenky do 02-Dots**:
```
---
název: "{{VALUE:název myšlenky}}"
vytvořeno: {{DATE:YYYY-MM-DD HH:mm}}
status: 💡idea
priorita: {{VALUE:priorita|vysoká,střední,nízká}}
tags: [#💡idea, {{VALUE:další tagy}}]
---

# {{VALUE:název myšlenky}}

## Popis
{{VALUE:popis}}

## Související
- {{LINKCURRENT}}
```

Tato šablona automaticky propojí novou myšlenku s poznámkou, ze které byla vytvořena, a nastaví správné tagy pro váš PKM systém


## 3. Capture Choice - rychlé zachycení informací

## 3.1 Základní konfigurace

Capture Choice je ideální pro rychlé přidávání informací do existujících souborů bez přerušení pracovního toku [9](https://quickadd.obsidian.guide/docs/Choices/CaptureChoice):

1. Vytvořte novou volbu typu "Capture"
2. Nastavte "Capture To" na cílový soubor (např. `05-Calendar/{{DATE:YYYY-MM-DD}}.md`)
3. Povolte "Create file if it doesn't exist" pro automatické vytvoření souboru
4. Nastavte "Capture format" pro formátování zachyceného obsahu [9](https://quickadd.obsidian.guide/docs/Choices/CaptureChoice)
    

Výhoda Capture Choice spočívá v možnosti zaměřit se na konkrétní sekci v cílovém souboru pomocí nastavení "Insert at caret location" nebo "Insert at bottom/top of file" [9](https://quickadd.obsidian.guide/docs/Choices/CaptureChoice).

## 3.2 Pokročilé možnosti zachycení

Při konfiguraci Capture Choice máte k dispozici několik užitečných nastavení [9](https://quickadd.obsidian.guide/docs/Choices/CaptureChoice):
- **Insert after line** - vložení obsahu za řádek obsahující určitý text
- **Insert at caret location** - vložení na pozici kurzoru v aktuálním souboru
- **Save as task** - automatické formátování jako úkol
- **Prepend/Append line** - přidání prázdného řádku před/za zachycený obsah
    

## 3.3 Praktické příklady

**Zachycení úkolu do denní poznámky**:

```
Capture To: 05 Calendar/Daily/{{DATE:YYYY-MM-DD}}.md
Insert after line: ## Úkoly
Capture format: - [ ] {{VALUE:úkol}} 📅 {{VDATE:termín,YYYY-MM-DD}} {{VALUE:priorita|⏫,🔼,🔽,}}
```

Tato konfigurace automaticky přidá nový úkol do sekce "Úkoly" v dnešní denní poznámce s možností nastavení termínu a priority [9](https://quickadd.obsidian.guide/docs/Choices/CaptureChoice)[10](https://sytone.dev/obsidian-tasks-x/6-advanced/quickadd/).

**Zachycení reference do složky Sources**:

```
Capture To: 04Sources/References.md
Insert at bottom of file
Capture format: - [{{VALUE:název}}]({{VALUE:url}}) - {{VALUE:poznámka}}
```

Tento příklad umožňuje rychlé uložení webových odkazů do centrálního souboru s referencemi.

## 4. Macro Choice - automatizace workflow

## 4.1 Úvod do maker

Macro Choice představuje nejmocnější komponentu QuickAdd, která umožňuje řetězit příkazy a vytvářet komplexní automatizované workflow [3](https://quickadd.obsidian.guide/docs/Choices/MacroChoice):
1. Vytvořte novou volbu typu "Macro"
2. Klikněte na ikonu ozubeného kola pro otevření Macro Builderu
3. Přidejte sekvenci příkazů pomocí tlačítka "Add Command"
4. Seřaďte příkazy přetažením v seznamu [3](https://quickadd.obsidian.guide/docs/Choices/MacroChoice)

V Macro Builder můžete kombinovat různé typy příkazů [3](https://quickadd.obsidian.guide/docs/Choices/MacroChoice):
- **Obsidian Command** - libovolný příkaz Obsidianu
- **User Script** - vlastní JavaScript kód
- **QuickAdd Choice** - zanořená volba QuickAdd
- **Wait** - časová prodleva mezi příkazy
- **Editor Commands** - manipulace s textem v editoru
    

## 4.2 Práce s User Scripts

User Scripts jsou JavaScript soubory, které rozšiřují funkčnost maker a umožňují vytvářet vlastní logiku [3](https://quickadd.obsidian.guide/docs/Choices/MacroChoice):

```
// 99-System/Scripts/quick-add/projectCreator.js
module.exports = async (params) => {
    const { quickAddApi, app, variables } = params;
    
    // Získání vstupu od uživatele
    const nazevProjektu = await quickAddApi.inputPrompt("Název projektu:");
    const typProjektu = await quickAddApi.suggester(
        ["🏢 Pracovní", "🏠 Osobní", "📚 Vzdělávací"],
        ["work", "personal", "education"]
    );
    
    // Nastavení proměnných pro šablonu
    variables.nazevProjektu = nazevProjektu;
    variables.typProjektu = typProjektu;
    variables.datumVytvoreni = quickAddApi.date.now("YYYY-MM-DD");
    
    console.log("Projekt byl vytvořen");
};
```

## 4.3 Příklady praktických maker

**Maker pro vytvoření projektové struktury**:
1. User Script pro získání informací o projektu
2. QuickAdd Choice pro vytvoření hlavního souboru projektu
3. Obsidian Command pro vytvoření složky projektu
4. Wait (500ms) pro zajištění dokončení operace
5. User Script pro aktualizaci projektového indexu
    

**Maker pro zpracování inbox položky**:


```javascript
module.exports = async (params) => {
    const { quickAddApi, app, variables } = params;
    
    // Získání aktuálního souboru
    const activeFile = app.workspace.getActiveFile();
    if (!activeFile || !activeFile.path.includes("00 Inbox")) {
        new Notice("Tento skript funguje pouze pro soubory v Inboxu");
        return;
    }
    
    // Získání typu položky
    const typPolozky = await quickAddApi.suggester(
        ["💡 Myšlenka", "🚀 Projekt", "📚 Zdroj"],
        ["idea", "project", "source"]
    );
    
    // Přesun do správné složky podle typu
    let cilovaSlozka;
    switch (typPolozky) {
        case "idea": cilovaSlozka = "02 Dots"; break;
        case "project": cilovaSlozka = "03 Efforts"; break;
        case "source": cilovaSlozka = "04 Sources"; break;
    }
    
    // Přesun souboru
    variables.cilovaSlozka = cilovaSlozka;
    variables.puvodniNazev = activeFile.basename;
    
    // Další příkaz v makru přesune soubor
};
```

Tento skript automatizuje třídění položek z vašeho Inboxu do správných složek podle PKM struktury


## 5. Multi Choice - organizace workflow

## 5.1 Základní použití

Multi Choice funguje jako organizační složka pro ostatní volby, což umožňuje vytvářet přehlednou hierarchickou strukturu [12](https://quickadd.obsidian.guide/docs/Choices/MultiChoice):
1. Vytvořte novou volbu typu "Multi"
2. Přetáhněte existující volby pod tuto Multi Choice
3. Kliknutím na šipku můžete rozbalit/sbalit kategorii
Příklad organizace pro váš PKM systém:
- **📥 Inbox Management**
    - Zachytit myšlenku
    - Zachytit úkol
    - Zpracovat položku
- **📝 Denní poznámky**
    - Vytvořit denní poznámku
    - Přidat do denní poznámky
- **🚀 Projekty**
    - Nový projekt
    - Aktualizovat projekt
    - Dokončit projekt

Nejužitečnější metody QuickAdd API [4](https://quickadd.obsidian.guide/docs/QuickAddAPI):

- **inputPrompt/wideInputPrompt** - získání vstupu od uživatele
- **suggester** - výběr z nabídky možností
- **checkboxPrompt** - výběr více položek pomocí zaškrtávacích políček
- **executeChoice** - spuštění jiné QuickAdd volby
- **date.now/tomorrow/yesterday** - práce s daty
    

