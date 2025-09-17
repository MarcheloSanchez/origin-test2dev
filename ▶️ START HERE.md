# Origin Vault - Vzorová implementace "Quick Start" sekce

> Toto je praktický příklad implementace nové instance

---

## ⚡ Rychlý start

### 🎯 Cíl: Zprovoznit Origin Vault za 5 minut

#### Předpoklady
- ✅ **Obsidian 1.4.0+** ([stáhnout zde](https://obsidian.md/download))
- ✅ **Základní znalost Markdown** ([2-min tutorial](https://commonmark.org/help/))  
- ✅ **10 minut času** na první setup
- ✅ **Ochota experimentovat** s novým systémem

---

### 🚀 Instalace za 5 kroků

#### Krok 1: Získání vaultu (30 sekund)  [[🌱develop]] 
```bash
# Možnost A: Stáhnout ZIP
wget https://github.com/yourusername/origin-vault/archive/main.zip

# Možnost B: Git clone (doporučeno)
git clone https://github.com/yourusername/origin-vault.git
```

#### Krok 2: Otevření v Obsidianu (30 sekund)
1. Spusť Obsidian
2. Klikni "Open folder as vault"
3. Vyber stažený `origin-vault` adresář

#### Krok 3: Aktivace pluginů (2 minuty)
> **⚠️ Důležité**: Origin vyžaduje tyto pluginy pro plnou funkcionalnost

**Essential pluginy** (musí být aktivní):
**Jak aktivovat**:
1. `Ctrl+,` → Settings
2. Community Plugins → Browse
3. Najdi a instaluj: `Templater`, `Dataview`, `Tasks`
4. Zapni v Community Plugins listu

#### Krok 4: Import nastavení (1 minuta)
```markdown
📁 .obsidian/
├── hotkeys.json      ← klávesové zkratky
├── plugins/          ← plugin konfigurace  
└── workspace.json    ← rozložení panelů
```

**Automatický import**:
- Nastavení se načtou automaticky při otevření vaultu
- Pokud ne: Settings → "Reload app" (Ctrl+R)

#### Krok 5: První poznámka (1 minuta)
```markdown
🎯 Test workflow:
1. Stiskni Ctrl+Shift+I (Quick Capture)
2. Napiš: "Můj první Origin záznam"
3. Poznámka se vytvoří v 00-Inbox s [[📥inbox]] tagem
4. Gratulace! 🎉 Systém funguje
```

---

### 🧭 Orientace v systému (bonus +3 minuty)

#### Klíčové soubory pro start
| Soubor | Účel | Odkaz |
|--------|------|-------|
| `README.md` | Tento průvodce | [[README]] |
| `My PKM MOC.md` | Kompletní mapa systému | [[My PKM MOC]] |
| `Home.md` | Denní dashboard | [[🏡Home]] |

#### Základní navigace
- **`Ctrl+O`** - Quick Switcher (najdi jakoukoliv poznámku)
- **`Ctrl+P`** - Command Palette (všechny akce)
- **`Ctrl+Shift+I`** - Quick Capture do Inboxu

#### První úkoly
- [ ] **Prozkoumej**: [[My PKM MOC]] pro kompletní přehled
- [ ] **Nastav**: Projdi [[Hotkeys & Automation]] pro optimalizaci
- [ ] **Experimentuj**: Vytvoř 5 poznámek do různých složek

---

### 🚨 Troubleshooting

#### ❌ Problém: Templater nefunguje
**Řešení**:
1. Settings → Templater → Template folder path: `99-System/Templates`
2. Zapni: "Trigger Templater on new file creation"

#### ❌ Problém: Dataview nezobrazuje tabulky  
**Řešení**:
1. Settings → Dataview → Enable JavaScript Queries: ON
2. Restart Obsidian (Ctrl+R)

#### ❌ Problém: Hotkeys nefungují
**Řešení**:
1. Settings → Hotkeys → Import hotkeys z `.obsidian/hotkeys.json`
2. Nebo manually: zkopíruj z [[Hotkeys & Automation]]

#### 💬 Další pomoc [[🌱develop]] 
- **Discord**: [Origin PKM Community](#)
- **Issues**: [GitHub Issues](#)
- **Email**: your.email@domain.com

---

### ✨ Co dál?

#### Pokud se ti líbí základy (5-10 min)
1. **📚 Studium**: [[My PKM Workflows - Global Guidelines]]
2. **🏷️ Tagy**: [[My PKM Tags]] - kompletní tagovací systém
3. **📊 Metadata**: [[My PKM Metadata]] - organizace dat

#### Pro pokročilé (20-30 min)  
1. **🔧 Customizace**: Přizpůsob složky podle svých potřeb
2. **⚡ Automatizace**: Nastav vlastní Templater skripty
3. **📈 Tracking**: Implementuj performance metriky

#### Pro týmy/organizace (1-2 hodiny)
1. **🤝 Collaboration**: Git workflow pro týmovou práci
2. **📋 Governance**: Metadata standards a audit procesy  
3. **🎓 Training**: Onboarding program pro nové členy

---

### 🎯 Success Criteria

**Po dokončení Quick Startu umíš**:
- ✅ Vytvořit novou poznámku pomocí Ctrl+Shift+I
- ✅ Najít jakoukoliv poznámku pomocí Ctrl+O
- ✅ Pochopit základní folder strukturu (00-06)
- ✅ Použít základní tagy (#💡idea, [[🚀project]])
- ✅ Navigovat pomocí [[My PKM MOC]]

**🎉 Gratulace! Máš funkční PKM systém.**

> **💡 Tip**: Systém se plně rozvirne po 2-3 týdnech aktivního používání. Buď trpělivý a experimentuj!

⬆️:: [[🏡Home]]