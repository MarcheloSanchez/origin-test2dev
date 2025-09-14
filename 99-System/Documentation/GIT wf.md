<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" class="logo" width="120"/>

## Short 
```
cd /cesta/k/rozbalene/slozce/Origin-Prod-2025-07-10 git init git add . git commit -m "Initial commit: Origin release" git branch -m main git remote add origin <URL_TVÉHO_REPOZITÁŘE> git push -u origin main
```

## **1. Inicializace Git repositáře**

1. **Instalace Gitu:**
Pokud ještě nemáš Git nainstalovaný, stáhni a nainstaluj ho z oficiálních stránek (git-scm.com).
2. **Rozbal ZIP:**
Rozbal obsah ZIP souboru do prázdné složky (např. `Origin-Prod-2025-06-25`).
3. **Otevři terminál:**
Otevři terminál a přepni se do složky s rozbaleným vaultem:

```bash
cd /cesta/k/tvoji/slozce/Origin-Prod-2025-06-25
```

4. **Inicializace repositáře:**

```bash
git init
```

5. **Přidej všechny soubory:**

```bash
git add .
```

6. **Vytvoř první commit:**

```bash
git commit -m "Initial backup of Origin-Prod vault"
```

7. Set main branch
```
# Make 'main' the default branch name for *all* new repos on your machine
git config --global init.defaultBranch main

# sanity-check
git config --global --get init.defaultBranch   # should print: main
```

## **2. Připojení k vzdálenému repositáři (např. GitHub)**

1. **Vytvoř nový repositář na GitHubu:**
    - Přihlaš se na GitHub.com.
    - Klikni na „New repository“.
    - Nastav repositář jako „Private“.
2. **Zkopíruj URL repositáře:**
(Např. `https://github.com/tvojemail/origin-prod-backup.git`)
3. **Přidej vzdálený repositář do lokálního:**

```bash
git remote add origin https://github.com/MarcheloSanchez/Origin_test_v1.2.1
```

4. **Pushni změny na GitHub:**

```bash
git push -u origin main
```

```
git push --set-upstream origin-test master
```

(Pokud ti Git bude nadávat na název větve, můžeš použít `master` místo `main`.)

## **3. Týdenní záloha – manuální proces**

1. **Rozbal nový ZIP do stejné složky** (přepiš staré soubory).
2. **V terminálu:**

```bash
git add .
git commit -m "Weekly backup - YYYY-MM-DD"
git push origin main
```

(Nahraď datum aktuálním dnem.)

## **4. Automatizace (volitelné)**

Pokud chceš proces zautomatizovat, můžeš vytvořit jednoduchý shell skript a spouštět ho každý týden:

```bash
#!/bin/bash
cd /cesta/k/tvoji/slozce/Origin-Prod-2025-06-25
git add .
git commit -m "Weekly backup - $(date '+%Y-%m-%d')"
git push origin main
```

Tento skript můžeš spustit přes plánovač úloh ve Windows nebo přes `cron` na Mac/Linux[^13][^14][^9].

## **5. Doporučené best practices**

- **Vytvoř `.gitignore`:**
Přidej do složky soubor `.gitignore` s těmito řádky, aby se nesynchronizovaly dočasné a konfliktní soubory:

```
.obsidian/workspace
.obsidian/workspace.json
.obsidian/cache
.trash/
.DS_Store
*.tmp
```

- **Privátní repositář:**
Ujisti se, že je repositář na GitHubu nastaven jako „Private“.
- **Záloha před pushnutím:**
Pokud provádíš změny v poznámkách, nejprve si udělej kopii ZIPu, pak teprve rozbal a pushni.

Tento postup ti umožní mít přehled o změnách mezi jednotlivými verzemi, vrátit se k předchozím verzím a mít vše bezpečně zálohované na GitHubu[^7][^9][^14].

# NEW_ think about about adding to wf 

```
git fetch origin --prune
git branch -a
git ls-remote --heads origin
```

---
# Sources
<div style="text-align: center">⁂</div>

[^1]: My-PKM-Metadata.md

[^2]: My-PKM-Workflows-Global-Guidelines.md

[^3]: My-PKM-Queries.md

[^4]: My-PKM-Tags.md

[^5]: My-PKM-Folders.md

[^6]: My-PKM-Tasks.md

[^7]: https://forum.obsidian.md/t/the-easiest-way-to-setup-obsidian-git-to-backup-notes/51429

[^8]: https://www.reddit.com/r/ObsidianMD/comments/103afmo/the_easiest_way_to_setup_obsidian_git_to_backup/

[^9]: https://dannb.org/blog/2024/obsidian-backup-github/

[^10]: https://dev.to/padiazg/how-to-sync-your-obsidian-vault-using-github-a-complete-guide-2l08

[^11]: https://readmedium.com/how-to-effortlessly-backup-your-obsidian-vault-with-git-plugin-and-github-65e45edbba20

[^12]: https://www.youtube.com/watch?v=uBRRVmQRe2s

[^13]: https://soumyardas.com/blog/2025/Automated_GitHub-Backups_for_Obsidian_Vault/

[^14]: https://www.codyantunez.com/blog/backup-obsidian-with-git/

[^15]: https://github.com/denolehov/obsidian-git/issues/68

[^16]: https://www.youtube.com/watch?v=sL-GUmdQ-nk

[^17]: https://www.dsebastien.net/how-i-synchronize-and-backup-my-obsidian-notes/

[^18]: https://github.com/Vinzent03/obsidian-git

[^19]: https://www.youtube.com/watch?v=ehjZUeTM7iE

