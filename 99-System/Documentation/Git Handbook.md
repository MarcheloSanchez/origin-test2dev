Tato příručka shrnuje klíčové příkazy Git, doporučené workflow, strategie větvení a postupy pro řešení nejčastějších chyb. Cílí na vývojáře v rámci projektu ORIGIN, ale je plně využitelná v libovolném týmu.

První odstavec (shrnutí)
Git je distribuovaný VCS umožňující **lokální plnou historii, bezpečné větvení a rychlé slučování**. Praktická efektivita však závisí na správném nastavení, disciplíně při commitech, předem dohodnuté strategii větvení a automatizovaných kontrolách. Tato příručka nabízí stručnou referenci příkazů, navržené procesy (commit → push → CI → merge) i návody, jak zachránit ztracené commity.

## 1. Základy a konfigurace

### 1.1 Globální nastavení

```bash
git config --global user.name  "Vaše Jméno"
git config --global user.email "email@example.com"
git config --global core.editor "code --wait"
git config --global core.autocrlf input   # Linux/macOS
# nebo
git config --global core.autocrlf true    # Windows
```

| Přepínač | Význam | Doporučení |
| :-- | :-- | :-- |
| `core.autocrlf` | Konverze EOL | `input` na Unix, `true` na Windows |
| `pull.rebase` | Výchozí chování `git pull` | `true` pro čistou historii |
| `alias.` | Zkratky příkazů | Např. `st=status`, `co=checkout` |

### 1.2 Struktura repozitáře

Souborový strom `.git/` obsahuje **objects** (blob, tree, commit, tag), **refs** (branches, tags) a **hooks**.
Pro obnovu historie slouží **reflog** (`git reflog`).

## 2. Denní workflow

### 2.1 Přehled kroků

1. **sync** – `git fetch --all`
2. **update branch** – `git rebase origin/main`
3. **práce ve feature větvi** – krátké, jen několik commitů
4. **commit** – atomický, s imperativním popisem (`feat: …`, `fix: …`)
5. **push** – `git push --set-upstream origin feature/xyz`
6. **Pull Request** → CI → review → merge

Infografické schéma běžného toku commit/stage/index je vidět zde

![Infografika Git workflow s větvemi, commity a příkazy](https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/e1a9786e-c8e2-42b0-950a-81d1df422b48.png)

Infografika Git workflow s větvemi, commity a příkazy

### 2.2 Příkazy v praxi

| Úloha | Příkaz | Tip |
| :-- | :-- | :-- |
| Přidat změny | `git add -p` | interaktivní hunk selection |
| Kontrola diffu | `git diff --staged` | před commitem |
| Reset jednoho souboru | `git checkout -- soubor` |  |
| Reparace posledního commitu | `git commit --amend --no-edit` | zachová zprávu |
| Synchronizace s main | `git pull --rebase origin main` | vyhne se merge commitům |

## 3. Strategie větvení

| Strategie | Použití | Výhody | Nevýhody |
| :-- | :-- | :-- | :-- |
| **GitHub Flow** | SaaS, CD | jednoduchost, rychlé releasy | žádná paralelní verze |
| **Git Flow** | verze-major/minor | jasná role release/hotfix | složitost, dlouhé větve |
| **Trunk-Based** | micro-services | CI/CD, feature flags | vyžaduje disciplínu |

Vizualizované srovnání strategií

![Porovnání strategií větvení ve Gitu](https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/152fcad5-d7f9-48c1-8ac0-5a06e60ba1bf.png)

Porovnání strategií větvení ve Gitu

**Pro ORIGIN** navrhujeme **GitHub Flow s krátkými feature vetvemi** doplněný o protection rules (`require status checks`, `require PR review`).

## 4. Hooks a automatizace

| Hook | Účel | Nástroj |
| :-- | :-- | :-- |
| `pre-commit` | lint, test, secret-scan | pre-commit framework |
| `commit-msg` | validace konvence (Conventional Commits) | commitlint |
| `pre-push` | spustit unit testy | bash/pytest |
| `post-merge` | auto-install závislostí | `npm ci` |

Instalace:

```bash
pip install pre-commit
pre-commit install
```


## 5. Řešení častých problémů

| Problém | Příčina | Rychlé řešení |
| :-- | :-- | :-- |
| **„detected dubious ownership“** | git 2.35 bezpečnostní kontrola | `git config --global --add safe.directory <cesta>` |
| **Ztracený commit po rebase** | force-push bez refs | `git reflog`, poté `git branch rescue HEAD@{2}` |
| **Staging omylem velkých souborů** | chybí `.gitignore` | `git reset <soubor>`, přidej pattern do `.gitignore` |
| **Merge conflict** | paralelní úpravy stejného řádku | `git merge --abort` → `git pull --rebase`, poté ruční fix |
| **LF/CRLF chaos** | nesprávné `core.autocrlf` | nastav dle OS a proveď `git add --renormalize .` |

## 6. Pokročilé příkazy

| Kategorie | Příkaz | Popis |
| :-- | :-- | :-- |
| Navigace | `git switch -c hotfix/x` | nová větev (moderní alias) |
| Revize | `git log --graph --oneline --decorate` | vizualizace historie |
| Rekapitulace | `git shortlog -sn --since="last month"` | přehled autorů |
| Obnova | `git restore --staged <f>` | sundá ze stage |
| Reflog | `git reset --hard HEAD@{3}` | návrat na stav před 3 operacemi |
| Bisect | `git bisect start` | binární hledání chybného commitu |

## 7. Best Practices

- **Commitujte často** a atomicky; jeden commit = jedna logická změna.
- **Nepoužívejte `git add .`** w/out kontroly; raději interaktivní přidávání.
- **Branch < 3 dny**; dlouhé větve zvyšují konflikty.
- **CI pipeline mandatory** (`lint → test → build`).
- **Sign-off a GPG podpisy** pro auditovatelnost.
- **Rebase před mergem**, ne po merge do main.
- **.gitignore** udržujte verziovanou; citlivá data dejte do Secrets Manageru.


## 8. Klíčový checklist pro nový projekt

1. `.gitignore` šablona (jazyk, IDE).
2. Soubor `.gitattributes` s `* text=auto` a případnými `eol`.
3. `CONTRIBUTING.md` s popisem commit zpráv a flow.
4. CI workflow (GitHub Actions).
5. Nastavené branch protection a min. 1 reviewer.
6. Instalované `pre-commit` hooky.

## Závěr

Správně nastavený Git proces **minimalizuje riziko ztráty práce, usnadňuje code-review a zrychluje releasy**. Sledujte výše uvedené postupy, využívejte automatizaci a nástroje (hooks, CI) a Git se stane spolehlivým základem vývoje projektu ORIGIN.

<div style="text-align: center">⁂</div>

[^1]: https://docs.gitlab.com/topics/git/commands/

[^2]: https://stackademic.com/blog/git-workflow-best-practices-for-a-smooth-and-efficient-development-process

[^3]: https://docs.gitlab.com/topics/git/troubleshooting_git/

[^4]: https://www.gitkraken.com/learn/git/commands

[^5]: https://daily.dev/blog/git-best-practices-effective-source-control-management

[^6]: https://graphite.dev/guides/debugging-common-git-errors

[^7]: https://www.datacamp.com/blog/git-commands

[^8]: https://dev.to/ajmal_hasan/beginner-friendly-git-workflow-for-developers-2g3g

[^9]: https://www.kunal-chowdhury.com/2023/04/troubleshooting-git.html

[^10]: https://www.atlassian.com/git/glossary

[^11]: https://axify.io/blog/git-workflow

[^12]: https://www.geeksforgeeks.org/git/common-git-problems-and-their-fixes/

[^13]: https://about.gitlab.com/images/press/git-cheat-sheet.pdf

[^14]: https://github.com/Piwigo/Piwigo/wiki/Git-workflow-and-best-pratices

[^15]: https://moldstud.com/articles/p-troubleshooting-gitflow-answers-to-common-issues-and-solutions

[^16]: https://git-scm.com/docs/git

[^17]: https://www.reddit.com/r/git/comments/1972njp/git_workflows_best_practices_branching_strategies/

[^18]: https://ohshitgit.com

[^19]: https://git-scm.com/docs

[^20]: https://www.gitkraken.com/learn/git/best-practices/git-branch-strategy

[^21]: https://www.chucksacademy.com/en/topic/git-github/advanced-git-usage-rebase-cherry-pick

[^22]: https://builtin.com/software-engineering-perspectives/git-rebase-vs-merge

[^23]: https://faun.pub/custom-pre-commit-and-post-commit-git-hooks-for-security-and-backups-aa117b917f17

[^24]: https://www.cloudthat.com/resources/blog/optimizing-your-git-workflow-a-guide-to-advanced-commands/

[^25]: https://www.simplilearn.com/git-rebase-vs-merge-article

[^26]: https://courses.csail.mit.edu/6.S194/13/lessons/03-git/adding-custom-hooks-to-git.html

[^27]: https://obedmacallums.com/posts/advanced-git-commands/

[^28]: https://stackoverflow.com/questions/16666089/whats-the-difference-between-git-merge-and-git-rebase

[^29]: https://dev.to/jmarhee/using-pre-commit-and-post-update-git-hooks-1e54

[^30]: https://viblo.asia/p/chapter-6-advanced-git-techniques-stashing-rebasing-and-cherry-picking-3kY4g5byLAe

[^31]: https://www.geeksforgeeks.org/git/git-difference-between-merging-and-rebasing/

[^32]: https://git-scm.com/book/it/v2/Customizing-Git-Git-Hooks

[^33]: https://www.toptal.com/git/the-advanced-git-guide

[^34]: https://www.atlassian.com/git/tutorials/merging-vs-rebasing

[^35]: https://www.lizard.global/blog/what-are-git-hooks-how-do-you-do-a-pre-commit-hook

[^36]: https://talent500.com/blog/advanced-git-version-control-guide/

[^37]: https://blog.git-init.com/differences-between-git-merge-and-rebase-and-why-you-should-care/

[^38]: https://pre-commit.com

[^39]: https://dev.to/elayaraj31/day-5-git-rebase-git-stash-git-cherry-pick-2l06

[^40]: https://www.reddit.com/r/git/comments/wkajik/rebase_vs_merge/

[^41]: https://linuxize.com/post/how-to-configure-git-username-and-email/

[^42]: https://www.geeksforgeeks.org/git/how-to-handle-sensitive-data-in-a-public-git-repo/

[^43]: https://support.atlassian.com/bitbucket-cloud/kb/git-command-returns-fatal-error-detected-dubious-ownership/

[^44]: https://stackoverflow.com/questions/37805621/change-email-address-in-git

[^45]: https://www.checkpoint.com/cyber-hub/cloud-security/what-is-developer-security/21-security-best-practices-for-github/

[^46]: https://github.com/orgs/community/discussions/63768

[^47]: https://www.dedicatedcore.com/blog/git-config-username-email/

[^48]: https://orca.security/resources/blog/sensitive-info-in-git-repository/

[^49]: https://www.theserverside.com/blog/Coffee-Talk-Java-News-Stories-and-Opinions/Five-ways-to-fix-Gits-fatal-repository-not-found-error

[^50]: https://www.codewalnut.com/tutorials/how-to-configure-git-user-name-and-user-email

[^51]: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository

[^52]: https://www.danielcrabtree.com/blog/176/how-to-fix-fatal-error-with-git-in-visual-studio-2017

[^53]: https://support.atlassian.com/bitbucket-cloud/docs/configure-your-dvcs-username-for-commits/

[^54]: https://dev.to/prankurpandeyy/git-security-best-practices-for-keeping-your-code-safe-1nep

[^55]: https://stackoverflow.com/questions/42667928/visual-studio-2017-git-failed-with-a-fatal-error

[^56]: https://docs.github.com/articles/setting-your-commit-email-address-in-git

[^57]: https://docs.github.com/en/code-security/getting-started/best-practices-for-preventing-data-leaks-in-your-organization

[^58]: https://jvns.ca/blog/2024/04/10/notes-on-git-error-messages/

[^59]: https://git-scm.com/book/ms/v2/Getting-Started-First-Time-Git-Setup

[^60]: https://snyk.io/blog/ten-git-hub-security-best-practices/

[^61]: https://www.youtube.com/watch?v=bMKW-VVWEZQ

[^62]: https://www.atlassian.com/git/tutorials/rewriting-history/git-reflog

[^63]: https://www.datacamp.com/tutorial/git-clean

[^64]: https://shafiul.github.io/gitbook/1_the_git_object_model.html

[^65]: https://www.reddit.com/r/Frontend/comments/y6fcmt/how_to_undo_git_reset_head/

[^66]: https://www.youtube.com/watch?v=Y2BdOJOwExs

[^67]: https://www.graphapp.ai/engineering-glossary/git/git-object-types-blob-tree-commit-tag

[^68]: https://opensource.com/article/18/6/git-reset-revert-rebase-commands

[^69]: https://www.theserverside.com/blog/Coffee-Talk-Java-News-Stories-and-Opinions/How-to-use-the-git-clean-command

[^70]: https://www.geeksforgeeks.org/git/git-internals/

[^71]: https://stackoverflow.com/questions/34519665/how-can-i-move-head-back-to-a-previous-location-detached-head-undo-commits

[^72]: https://www.atlassian.com/git/tutorials/undoing-changes/git-clean

[^73]: https://stackoverflow.com/questions/60247622/does-tree-object-type-in-git-internals-point-to-the-blob-only-or-to-trees-as-wel

[^74]: https://git-scm.com/docs/git-reflog

[^75]: https://www.geeksforgeeks.org/git/how-to-delete-untracked-files-in-git/

[^76]: https://git-scm.com/book/en/v2/Git-Internals-Git-Objects

[^77]: https://git-scm.com/book/en/v2/Git-Tools-Revision-Selection

[^78]: https://superuser.com/questions/335496/git-how-to-delete-all-untracked-files

[^79]: https://dev.to/siddhantkcode/from-stage-to-snapshot-unpacking-gits-index-blob-commit-operations-3683

[^80]: https://www.neilmacy.co.uk/blog/git-reflog

[^81]: https://www.geeksforgeeks.org/git/git-ignore-and-gitignore/

[^82]: https://stackoverflow.com/questions/2825428/why-should-i-use-core-autocrlf-true-in-git

[^83]: https://x-team.com/magazine/git-aliases-to-improve-your-workflow

[^84]: https://www.w3schools.com/git/git_ignore.asp

[^85]: https://stackoverflow.com/questions/39408793/git-core-autocrlf-line-ending-default-setting/48230871

[^86]: https://dev.to/sgolovine/awesome-git-shortcuts-2bpd

[^87]: https://www.atlassian.com/git/tutorials/saving-changes/gitignore

[^88]: https://git-scm.com/book/cs/v2/Customizing-Git-Git-Configuration

[^89]: https://gist.github.com/colmarius/6c927994f0de197cf4ea

[^90]: https://www.codecademy.com/article/how-to-use-gitignore

[^91]: https://markentier.tech/posts/2021/10/autocrlf-true-considered-harmful/

[^92]: https://stackoverflow.com/questions/2553786/how-do-i-alias-commands-in-git

[^93]: https://stackoverflow.com/questions/33189437/explain-gitignore-pattern-matching

[^94]: https://docs.github.com/en/get-started/git-basics/configuring-git-to-handle-line-endings

[^95]: https://www.atlassian.com/git/tutorials/git-alias

[^96]: https://dev.to/ritaly/git-lesson-how-to-use-gitignore-and-gitkeep-5edm

[^97]: https://git-scm.com/book/en/v2/Customizing-Git-Git-Configuration

[^98]: https://git-scm.com/book/en/v2/Git-Basics-Git-Aliases

[^99]: https://www.env0.com/blog/gitignore-command-guide-practical-examples-and-terraform-tips

[^100]: https://www.reddit.com/r/git/comments/s8kr76/how_to_configure_git_to_never_modify_a_line_ending/

[^101]: https://graphite.dev/guides/git-hooks

[^102]: https://www.thisdot.co/blog/git-reflog-a-guide-to-recovering-lost-commits

[^103]: https://stackoverflow.com/questions/3206843/how-line-ending-conversions-work-with-git-core-autocrlf-between-different-operat

[^104]: https://stefaniemolin.com/articles/devx/pre-commit/setup-guide/

[^105]: https://opensource.com/article/23/1/git-reflog

[^106]: https://github.com/progit/progit2/issues/1091

[^107]: https://rewind.com/blog/how-to-restore-deleted-branch-commit-git-reflog/

[^108]: https://dev.to/midnqp/the-fuss-with-crlf-and-lf-in-git-4nnf

[^109]: https://githooks.com

[^110]: https://blog.codeminer42.com/git-reflogs-a-guide-to-rescuing-your-lost-work/

[^111]: https://www.youtube.com/watch?v=ObksvAZyWdo

[^112]: https://stackoverflow.com/questions/10099258/how-can-i-recover-a-lost-commit-in-git

[^113]: https://dev.to/kevinshu/git-and-normalization-of-line-endings-228j

[^114]: https://pumpingco.de/blog/the-ultimate-guide-to-git-hooks/

[^115]: https://www.reddit.com/r/git/comments/zd2v88/recovering_lost_commits_with_git_reflog/

[^116]: https://git-scm.com/book/ms/v2/Customizing-Git-Git-Hooks

[^117]: https://blog.kusho.ai/how-to-use-git-reflog-to-find-lost-commits/

