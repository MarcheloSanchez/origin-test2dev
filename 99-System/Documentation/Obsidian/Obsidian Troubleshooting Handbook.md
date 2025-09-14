<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" class="logo" width="120"/>

# Obsidian Troubleshooting Handbook

Praktický průvodce, jak odhalit a vyřešit chyby pluginů (Templater \& spol.) pomocí vestavěných nástrojů a konzole vývojáře

Obsidian je obvykle stabilní, ale pluginy mohou způsobit konflikty, pomalé spouštění či chybová hlášení. Tento handbook vysvětluje systematický postup – od rychlého rozpoznání problému přes využití „Safe Mode“ až po pokročilé ladění v Developer Console.

## Rychlá diagnostika a první kroky

1. **Zkontrolujte verzi Obsidian Installeru**
    - Nabídka Help → Check for Updates → „Download installer“. Starý Electron často způsobuje chyby načtení pluginů.
2. **Zapněte Safe Mode (Restricted Mode)**
*Settings → Community plugins → Turn on Safe Mode* – načte Vault bez komunitních pluginů.
3. **Debug Startup Time**
*Settings → Community plugins → Debug startup time* → restart. Čas > 3 000 ms u pluginu signalizuje viníka.
4. **Problém jen s jedním pluginem?**
    - Disable-all → Enable-one-by-one (nebo Divide-\&-Conquer: zapněte vždy polovinu seznamu).
    - Časté viníky: zastaralé verze Templater, Dataview, Excalidraw, Omnisearch.

## Typické chyby a jejich řešení

| Symptomy | Pravděpodobná příčina | Rychlé opravy |
| :-- | :-- | :-- |
| „Failed to load community plugins“ při startu | - Chybný `manifest.json`, chybějící `main.js`, nekompatibilní Electron | -  Update installer -  Překompilujte plugin (`npm run build`) -  Zkontrolujte `isDesktopOnly` |
| „Template parsing error, aborting“ (Templater) | Syntaxe `undefined`; chybějící proměnná; jiný plugin mění soubor při renderu | -  Otevřete Dev Console, karta Console → vyhledejte stack-trace -  Spusťte Templater v novém Vaultu -  Zkontrolujte konflikt s Linter/Dataview |
| Dlouhé „Loading cache…“ | Poškozený index / velký počet souborů / plugin načítá JSON | -  Smažte `Vault/.obsidian/cache/Cache_Data/*` -  Disable Omnisearch, Full-Calendar -  Rozdělte Vault / vypněte preload externích souborů |
| Obsidian padá na mobilu | RAM limit, plugin používá Node/Electron API | -  Disable plugin na mobilu (manifest `isDesktopOnly`) -  V Settings → Advanced → „Show debug info“ zkontrolujte RAM |

## Hloubková analýza v Developer Console

### Jak otevřít

*Windows/Linux* `Ctrl + Shift + I`; *macOS* `Cmd + Opt + I`.
V mobilním Chrome DevTools: `chrome://inspect` a zapněte USB debugging.

![Screenshot of Obsidian app with developer console open showing HTML elements and styles for troubleshooting plugins.](https://pplx-res.cloudinary.com/image/upload/v1749155185/pplx_project_search_images/de1cebe966c900bae6fd6c2e8bd91206f66e3afd.jpg)

Screenshot of Obsidian app with developer console open showing HTML elements and styles for troubleshooting plugins.

### Klíčové panely

| Panel | K čemu slouží |
| :-- | :-- |
| **Console** | Červené chyby – hledejte stack-trace (`Templater Error: …`). Klikněte pravým → Save as… a přiložte k bug reportu. |
| **Sources** | Strom všech načtených pluginů (`plugin:templater-obsidian`). Nastavte breakpoint (`debugger;`) pro sledování proměnných. |
| **Performance** | *Record* → reprodukujte zpomalení → *Stop* → „Bottom-Up“ ukáže, který skript brzdí. |
| **Network** | 404 na `main.js` při načítání = špatně nainstalovaný plugin. |

![Screenshot of Obsidian developer console 'Sources' tab showing plugin source code and debugging breakpoints for troubleshooting.](https://pplx-res.cloudinary.com/image/upload/v1749155185/pplx_project_search_images/0bfe8bf60baf086118d94822f8efe85ef107321f.jpg)

Screenshot of Obsidian developer console 'Sources' tab showing plugin source code and debugging breakpoints for troubleshooting.

### Užitečné příkazy v konzoli

```js
// Přepnutí do mobilní emulace
this.app.emulateMobile(!this.app.isMobile);

// Zjištění verzí
console.log(this.app.getVersion(), process.versions.electron);

// Vypsání aktivních pluginů a jejich času načtení
this.app.plugins.pluginsList.map(p=>[p.manifest.id, p.loadTime])
```


## Postup obnovy po pádu pluginu

1. **Zálohujte** Vault → pokud Obsidian neotevřete, archivujte celý adresář.
2. **Odstraňte sporný plugin**
    - přejmenujte `Vault/.obsidian/plugins/PLUGIN-FOLDER` (např. `Templater_broken`).
3. **Vyčistěte cache a IndexDB**
    - Smažte `Cache_Data/*`, soubory `IndexedDB/*`, `workspace.json` – automaticky se znovu vytvoří.
4. **Spusťte Obsidian v Safe Mode** a ověřte, zda Vault naskočí.
5. **Aktualizujte plugin** z Community store nebo z GitHubu (re-release s novým Electronem).
6. **Reportujte chybu**
*Command palette → Show debug info → Copy* + uložený log z konzole přiložte k issue.

![Obsidian error message indicating failure to load community plugins.](https://pplx-res.cloudinary.com/image/upload/v1752276424/pplx_project_search_images/00815bb86f1c5adb7a18843914970bf82cc25361.jpg)

Obsidian error message indicating failure to load community plugins.

## Best Practices pro prevenci chyb

- **Pravidelné aktualizace**: Core + installer + pluginy (`Check for updates → Update all`).
- **Kontrola manifestu**: `minAppVersion` odpovídá aktuální verzi; `isDesktopOnly=false`, pokud cílíte na mobil.
- **Šetřete RAM**: Minimalizujte autosave interval Excalidraw, omezte Dataview na vybrané složky.
- **Plugin sandbox**: Testujte nové pluginy v prázdném Vaultu.
- **Verzování nastavení**: Sync-ovat `.obsidian` složku, ale exclude velké přílohy.

![Obsidian vault configuration sync settings with all sync options enabled to ensure consistent plugin and appearance settings across devices.](https://pplx-res.cloudinary.com/image/upload/v1749430250/pplx_project_search_images/e3dd75492dfd3e83db8f7564eb1cd0438a838c90.jpg)

Obsidian vault configuration sync settings with all sync options enabled to ensure consistent plugin and appearance settings across devices.

## Časté otázky

**Musím po každé změně kódu restartovat Obsidian?**
Ano, plugin se znovu načte jen při restartu nebo pomocí `Reload app without saving` (Ctrl/Cmd + R) v devtools.

**Jak poznám, že chyba je opravdu v Templateru?**
V konzoli hledejte `plugin:templater-obsidian`. Pokud stack-trace vede do `Templater.js`, problém je v šabloně; pokud začíná v `app.js`, jde o konflikt jiného pluginu.

**Co dělat, když se chybová hláška neukáže?**
V *Settings → About → Override internal console logs* zapněte a restartujte; poté se i tichá chyba zapíše do logu.

## Závěr

Sledováním těchto kroků dokážete 90% potíží s pluginy (Templater, Dataview, Excalidraw…) odhalit a vyřešit během několika minut. Nezapomínejte na pravidelné aktualizace, zálohy a používání Developer Console – je to nejrychlejší cesta, jak zjistit, **čím je problém skutečně způsoben**.

![Obsidian community plugins interface showing enabled plugins and how to access the community plugins section.](https://pplx-res.cloudinary.com/image/upload/v1749004720/pplx_project_search_images/cbc9ac4cbe9e792aafdb69edbea655b40f5e4d1d.jpg)

Obsidian community plugins interface showing enabled plugins and how to access the community plugins section.

![Obsidian plugin community interface showing a null property error preventing plugin list display.](https://pplx-res.cloudinary.com/image/upload/v1752276424/pplx_project_search_images/e2be343e22befccf2f89c71d60da4bcde74f77fa.jpg)

Obsidian plugin community interface showing a null property error preventing plugin list display.

![Obsidian developer console showing uncaught TypeError errors related to undefined properties in app.js, useful for troubleshooting plugin issues.](https://pplx-res.cloudinary.com/image/upload/v1752276424/pplx_project_search_images/e53c9e2db2771901b8021f3931a8d22802ffa0aa.jpg)

Obsidian developer console showing uncaught TypeError errors related to undefined properties in app.js, useful for troubleshooting plugin issues.

<div style="text-align: center">⁂</div>

[^1]: https://www.youtube.com/watch?v=_FuNmnBr5rI

[^2]: https://github.com/KjellConnelly/obsidian-dev-tools

[^3]: https://www.reddit.com/r/ObsidianMD/comments/ua35pa/templater_plugin_syntax_not_working_in_obsidian/

[^4]: https://www.reddit.com/r/ObsidianMD/comments/ud1hu3/failed_to_load_community_plugins/

[^5]: https://github.com/glowingjade/obsidian-smart-composer/wiki/3.-Troubleshooting

[^6]: https://www.youtube.com/watch?v=kJ-zf6DDep0

[^7]: https://forum.obsidian.md/t/templater-syntax-plugin-not-working/36359

[^8]: https://forum.obsidian.md/t/obsidian-community-plugins-not-opening/73844

[^9]: https://www.reddit.com/r/ObsidianMD/comments/120tt89/cannot_enable_certain_community_plugins/

[^10]: https://publish.obsidian.md/tasks-contributing/Debugging/Console+logging+facilities+in+Tasks

[^11]: https://github.com/SilentVoid13/Templater/issues/1277

[^12]: https://github.com/obsidian-tasks-group/obsidian-tasks/issues/2669

[^13]: https://forum.obsidian.md/t/obsidian-fails-to-load-community-plugins-at-launch/80872

[^14]: https://mprojectscode.github.io/obsidian-collection/plugin-dev/debuggingandprofiling/

[^15]: https://community.theforeman.org/t/errors-when-creating-custom-foreman-plugin/33277

[^16]: https://www.stephanmiller.com/creating-an-obsidian-plugin-with-claude/

[^17]: https://www.reddit.com/r/ObsidianMD/comments/1fr5pp7/ive_been_getting_this_error_in_obsidian_how_to/

[^18]: https://www.obsidianstats.com/tags/debugging

[^19]: https://support.atlassian.com/confluence/kb/after-upgrading-confluence-the-following-error-appears-in-the-logs-unable-to-resolve-comatlassianconfluencepluginstemplates/

[^20]: https://www.stephanmiller.com/using-jules-to-update-my-obsidian-plugin/

[^21]: https://gist.github.com/Fevol/b672865d61e54ac6f61e7c88aa05ba42

[^22]: https://publish.obsidian.md/drjerryasmith/Notes/Public/Concurrency+Debugging+Tools

[^23]: https://help.obsidian.md/plugin-security

[^24]: https://www.reddit.com/r/ObsidianMD/comments/15c1dc1/diagnose_which_elements_weights_on_performance/

[^25]: https://github.com/vrtmrz/obsidian-livesync/issues/274

[^26]: https://publish.obsidian.md/drjerryasmith/Notes/Public/Concurrency+Performance+Optimization

[^27]: https://forum.obsidian.md/t/option-for-safe-startup-or-restricted-launch-if-a-community-plugin-is-preventing-normal-launch/59554

[^28]: https://www.reddit.com/r/ObsidianMD/comments/1f49ubv/templater_debugging/

[^29]: https://github.com/zsviczian/obsidian-excalidraw-plugin/issues/295

[^30]: https://mike.bailey.net.au/notes/software/obsidian/performance/

[^31]: https://github.com/Vinzent03/obsidian-git/issues/803

[^32]: https://help.obsidian.md/resources

[^33]: https://forum.obsidian.md/t/community-plugin-failed-to-load/67462

[^34]: https://forum.obsidian.md/t/recommendation-to-optimize-obsidian-startup-speed/62855

[^35]: https://www.reddit.com/r/ObsidianMD/comments/1b993sa/makemd_plugin_conflict/

[^36]: https://forum.obsidian.md/t/failed-to-load-plugin-manifest/100138

[^37]: https://github.com/NixOS/nixpkgs/issues/273611

[^38]: https://blog.zicon.no/how-i-fixed-obsidian-hanging-when-moving-files.html

[^39]: https://www.youtube.com/watch?v=WNGMMgYJzww

[^40]: https://forum.obsidian.md/t/plugin-pr-not-working-your-latest-release-is-missing-the-file/76078

[^41]: https://forum.obsidian.md/t/update-electron-version-version-34-very-close-to-eol/100985

[^42]: https://forum.obsidian.md/t/stuck-on-loading-cache/42253?page=4

[^43]: https://docs.obsidian.md/Reference/Manifest

[^44]: https://www.reddit.com/r/ObsidianMD/comments/1emoglg/custom_obsidian_plugin_fails_to_load/

[^45]: https://forum.manjaro.org/t/questions-about-electron-apps/167481

[^46]: https://github.com/TfTHacker/obsidian42-brat/issues/4

[^47]: https://curtismchale.ca/2023/10/18/fix-obsidian-book-search-error/

[^48]: https://www.reddit.com/r/ObsidianMD/comments/1iotfx2/why_doesnt_obsidian_update_electron/

[^49]: https://help.obsidian.md/sync/troubleshoot

[^50]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Missing_parenthesis_after_argument_list

[^51]: https://forum.manjaro.org/t/obsidian-over-flatpak-or-electron/162724

[^52]: https://forums.obsidian.net/topic/68298-issue-problems-of-storing-information-in-registry-and-appdata-folders/

[^53]: https://www.reddit.com/r/ObsidianMD/comments/zn43i6/how_to_open_in_safe_mode/

[^54]: https://github.com/pieces-app/support/issues/574

[^55]: https://pieces.app/ai-memory/obsidian-md

[^56]: https://forum.obsidian.md/t/stuck-on-loading-cache/42253

[^57]: https://publish.obsidian.md/hub/04+-+Guides,+Workflows,+\&+Courses/Guides/How+to+debug+why+Obsidian+is+running+slowly

[^58]: https://forum.obsidian.md/t/css-and-plug-in-compatibility-issues/72537

[^59]: https://modrinth.com/modpack/obsidian-optimized/version/1.0.2

[^60]: https://javascript.plainenglish.io/obsidian-4-0-0-technical-brief-7dbcdf46d9ce

[^61]: https://excalidraw-obsidian.online/wiki/troubleshooting/compatibility

[^62]: https://talk.macpowerusers.com/t/wish-obsidian-was-less-memory-intensive/26489

[^63]: https://github.com/joethei/obsidian-plantuml/issues/63

[^64]: https://forum.obsidian.md/t/how-to-turn-on-safe-mode/92343

[^65]: https://www.reddit.com/r/ObsidianMD/comments/10fnz8d/how_do_i_know_if_a_plugin_is_compatible_with_the/

[^66]: https://excalidraw-obsidian.online/wiki/troubleshooting/performance

[^67]: https://github.com/blacksmithgu/obsidian-dataview/issues/1221

[^68]: https://github.com/Automattic/harper/issues/338

[^69]: https://forum.obsidian.md/t/pc-memory-issues-with-obsidian/83978

[^70]: https://docs.obsidian.md/Plugins/Getting+started/Mobile+development

[^71]: https://docs.obsidian.md/Plugins/Guides/Optimizing+plugin+load+time

[^72]: https://www.reddit.com/r/ObsidianMD/comments/1fg2oh3/performance_when_you_place_many_files_in_obsidian/

[^73]: https://www.reddit.com/r/ObsidianMD/comments/1g41eys/obsidian_stuck_on_loading_cache/

[^74]: https://www.reddit.com/r/ObsidianMD/comments/18tpzdn/which_featuresplugins_slow_down_obsidians_startup/

[^75]: https://www.zsolt.blog/2021/05/obsidian-performance-test-take-1.html

[^76]: https://help.obsidian.md/community-plugins

[^77]: https://www.reddit.com/r/ObsidianMD/comments/1g9zrhw/open_dev_console_for_android_play_store_version/

[^78]: https://publish.obsidian.md/omnisearch/Issues+\&+Solutions

[^79]: https://support.sourcegear.com/viewtopic.php?t=4206

[^80]: https://publish.obsidian.md/hub/02+-+Community+Expansions/02.05+All+Community+Expansions/Plugins/🗂️+Plugins

[^81]: https://github.com/davish/obsidian-full-calendar/issues/324

[^82]: https://forum.obsidian.md/t/slow-performance-with-large-vaults/16633

[^83]: https://www.obsidianstats.com/plugins/smart-rename

