⬆️:: [[TemplateR]]
Toto je zkrácená verze pro sjednocení syntaxe na one page. 
Zde je další počtení [[Templater Handbook 2025]]
## 🔧 Základní syntaxe

```
<% tp.function() %>              # Základní funkce
<%* JavaScript kód zde %>        # Multi-line JavaScript
<% tp.function("argument") %>    # Funkce s argumenty
```
## Pravidla syntaxe (ze search results):
- **MUSÍ** obsahovat opening tag `<%` a closing tag `%>`
- Všechny funkce začínají `tp.`
- Argumenty v závorkách `()`
- String argumenty v uvozovkách `"text"` nebo `'text'`
## 📄 File Functions

## File metadata

```
<% tp.file.title %>                          # Název souboru
<% tp.file.creation_date() %>               # 2025-06-09 21:57
<% tp.file.creation_date("YYYY-MM-DD") %>   # 2025-06-09
<% tp.file.last_modified_date() %>          # Datum poslední změny
<% tp.file.folder() %>                      # Název složky
<% tp.file.path() %>                        # Celá cesta k souboru
```
## File operations
```
<%* await tp.file.rename("New Name") %>     # Přejmenování souboru
<%* await tp.file.move("New Folder/") %>    # Přesun souboru
<% tp.file.cursor(1) %>                     # Umístění kurzoru
```
## 🎯 User Input & Prompts
**Prompty a inputy:**

```
await tp.system.prompt("Název projektu?")
await tp.system.suggester(["Volba 1", "Volba 2"], ["val1", "val2"])
await tp.system.clipboard()      // obsah schránky
```
**Obsidian notifikace:**
```
new Notice("Úspěšně vytvořeno!", 5000)
```
## Základní prompts
```
<%* const name = await tp.system.prompt("Enter name:") %>
<%* const choice = await tp.system.suggester(["Option 1", "Option 2"], ["value1", "value2"]) %>
<% name %>                                   # Vložení hodnoty
```
## Základní datum/čas
```
<% tp.date.now() %>                          # 2025-06-09 21:57
<% tp.date.now("YYYY-MM-DD") %>              # 2025-06-09
<% tp.date.now("dddd, MMMM DD, YYYY") %>     # Monday, June 09, 2025
<% tp.date.now("HH:mm:ss") %>                # 21:57:30
```
## Relativní data (ze search results)
```
<% tp.date.now("YYYY-MM-DD", 1) %>           # Zítra
<% tp.date.now("YYYY-MM-DD", -1) %>          # Včera
<% tp.date.now("YYYY-MM-DD", 7) %>           # Za týden
<% tp.date.weekday("dddd YYYY-MM-DD", 7) %>  # Příští pondělí
```

## Pokročilé datum operace
```
# První den příštího měsíce (ze search results)
<% tp.date.now("dddd YYYY-MM-DD", "P1M", tp.date.now("YYYY-MM") + "-01") %>

# Dny do Vánoc (ze search results)
<% moment.duration(moment("12-24", "MM-DD").diff(moment(), "days")) %>

# Můj narozeniny letos (ze search results)
<% moment("07-19", "MM-DD").fromNow() %>     # in 3 months

```

