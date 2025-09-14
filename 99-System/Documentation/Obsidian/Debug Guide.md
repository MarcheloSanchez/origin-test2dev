
⬆️:: [[🏡Home]]

1. Zapnutí vývojářských nástrojů  
    • V Obsidianu jdi do Settings ▶ About ▶ Enable developer tools.  
    • Nebo klávesovou zkratkou Ctrl + Shift + I (Cmd + Option + I na macOS).
    
2. Otevření „Console“ panelu  
    • V DevTools klikni na záložku **Console**.  
    • Vymaž jej (ikonka koše nebo zákaz zastavení) pro čistý výpis.
    
3. Spuštění šablony a zachycení chyby  
    • Vrať se do svého note, spusť Templater (např. pomocí Templater commandu nebo vložením `<%* … %>` a uložení).  
    • V Console teď uvidíš chybové hlášky (červený text), stack trace, případně varování.
    
4. Zkopírování logů a chyby  
    • Označ celý stack trace i s předchozími řádky v Console → pravé tlačítko → **Copy** ▶ **Copy message**.  
    • Pokud v Console vidíš `[Dataview]` nebo `[Templater]` logy, zkopíruj i je.
    
5. (Volitelné) Zapnutí detailnějšího logování  
	1. NEVIDÍM DEBUG možnost 
    • Pro Dataview: v Settings ▶ Plugins ▶ Dataview ▶ Debug mode on.  
    • Pro Templater: v Settings ▶ Plugins ▶ Templater ▶ Log level = Debug.  
    • Opakuj krok 3–4, teď uvidíš podrobnější informace o interních datech.
    
6. Extra: zachycení „Network“ a „Sources“  
    • Pokud manipulujete s externími requesty nebo template importy, může pomoci záložka **Network**.  
    • Ve **Sources** můžete nastavit breakpoint na váš `.js` skript a krokovat ho řádek po řádku.
    
7. Předání informací  
    • Pošlete:  
    – Celý console error + stack trace  
    – Případně screenshot Console s filtrem na „Errors“  
    – Vaši verzi Obsidianu, Templateru a Dataviewu (Settings ▶ About ▶ Version)  
    – Krátký popis, co jste spustili a jaký výsledek očekáváte


# Tipy 
Spuštění skriptu a sběr logů  
## a) Před uložením Templater šablony vkládejte na klíčová místa:

```
console.log("❓ proměnná allPages:", allPages);
console.log("Typ allPages:", Array.isArray(allPages), typeof allPages);
```