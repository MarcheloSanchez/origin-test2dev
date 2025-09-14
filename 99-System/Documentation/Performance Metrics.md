
⬆️:: [[🏡Home]]
[[📊Templater, Performance Metrics]]

## 📊Výkon - Performance
### 📶*Vault Growth: průměrný nárust souborů za týden*  
```dataviewjs
const all = dv.pages();
const last7 = all.where(p=>p.file.ctime>=window.moment().subtract(7,'days'));
dv.paragraph("Průměrný nárůst/den: **"+(last7.length/7).toFixed(1)+"**");
```
---
### 🏷️*Tag coverage* 
> Počet poznámek v celém vaultu, které mají aspoň 1 tag.
```dataviewjs
// Vypočítá % poznámek s alespoň jedním tagem
const pages = dv.pages("");
const taggedCount = pages.filter(p => p.file.tags?.length > 0).length;
const totalCount  = pages.length;
const pct         = ((taggedCount/totalCount)*100).toFixed(1);
dv.table(
  ["Metrika", "% poznámek s tagy"],
  [["Tag Coverage", `${pct} %`]]
);
```
---
## 📊Capture - Souhrn
### Týdenní
> [!info]- Dataview Capture Rate past Week
> 
> ```dataview
> table file.name as "Note", file.ctime as "Created"
> from ""
> where file.ctime >= date(today) - dur(7 days)
> ```

### Denní
> [!info]- Dataview Capture Rate Today
> 
> ```dataview
> table file.name as "Poznámka", file.ctime as "Vytvořeno"
> from ""
> where file.ctime >= date(today)
> ```

---
##  🔗LIST of TOP 10 most linked notes
``` dataview
LIST length(file.inlinks)
FROM ""
WHERE !contains(file.path, "06-Archive")
SORT length(file.inlinks) DESC
LIMIT 10
```
## 📊Počty - Statistika 
 - File Count: `$=dv.pages().length`
 - Daily notes + Habits: `$=dv.pages('"05 Journal"').length`

> [!info]- Celkem slov ve Vaultu - **Clickable**
> ```tracker
> searchType: fileMeta
> searchTarget: cDate, numWords
> xDataset: 0
> folder: /
> summary:
>     template: "Celkový počet slov v trezoru: {{sum(dataset(1))}}"
> ```



### 📈 Týdenní produktivita
```dataviewxxx
TABLE WITHOUT ID
  dateformat(date(today) - dur(6 days), "dd.MM") + " - " + dateformat(date(today), "dd.MM") as "Období",
  length(filter(rows.file.tasks, (t) => t.completed AND t.completion >= date(today) - dur(7 days))) as "✅ Dokončeno",
  length(filter(rows.file.tasks, (t) => t.created >= date(today) - dur(7 days))) as "📝 Nových úkolů",
  round(length(filter(rows.file.tasks, (t) => t.completed AND t.completion >= date(today) - dur(7 days))) / length(filter(rows.file.tasks, (t) => t.created >= date(today) - dur(7 days))) * 100, 1) + "%" as "📊 Completion Rate"
FROM ""
WHERE file.tasks
GROUP BY true
```

```
```dataviewjs
// Výkonnostní metriky podle vašeho GTD systému
const weeklyStats = {
  inbox: dv.pages('"00-Inbox"').where(p => p.status === "📥inbox").length,
  active: dv.pages('"03-Efforts"').where(p => p.status === "🔄active").length,
  completed: dv.pages().where(p => p.status === "✅completed" && 
    p.modified >= dv.date("today - 7 days")).length
};

dv.paragraph(`
**📈 Týdenní přehled:**
- 📥 Nové v inboxu: ${weeklyStats.inbox}
- 🔄 Aktivní projekty: ${weeklyStats.active}  
- ✅ Dokončeno za týden: ${weeklyStats.completed}
`);

```
```
