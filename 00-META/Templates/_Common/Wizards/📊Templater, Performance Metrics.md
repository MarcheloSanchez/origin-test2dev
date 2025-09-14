<%*  

  

const vault = app.vault;  

  

const inboxPath = "00-Inbox/";  

  

const processedFolders = ["02-Dots/", "03-Efforts/", "04-Sources/"];  

  

  

  

// Získání všech poznámek v Inboxu za posledních 7 dní  

  

const inboxNotes = vault.getMarkdownFiles().filter(file =>  

  

file.path.startsWith(inboxPath) &&  

  

moment(file.stat.ctime) > moment().subtract(7, 'days')  

  

);  

  

  

  

// Počet zpracovaných položek za 24 hodin  

  

const processedNotes = vault.getMarkdownFiles().filter(file =>  

  

processedFolders.some(folder => file.path.startsWith(folder)) &&  

  

moment(file.stat.mtime).diff(moment(file.stat.ctime), 'hours') < 24  

  

);  

  

  

  

// Výpočet metrik  

  

const captureRate = (inboxNotes.length / 7).toFixed(1);  

  

const processingEfficiency = ((processedNotes.length / inboxNotes.length) * 100 || 0).toFixed(1);  

  

  

  

return `## 📈 Výkonnostní metriky  

  

- **Denní Capture Rate:** ${captureRate} položek/den  

  

- **Processing Efficiency:** ${processingEfficiency}% (zpracováno do 24h)  

  

`;  

  

%>  

## 📈 Výkonnostní metriky  

- **Denní Capture Rate:** 0.0 položek/den  

- **Processing Efficiency:** 0.0% (zpracováno do 24h)  

  

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
## 📈 Výkonnostní metriky  

- **Denní Capture Rate:** 1.1 položek/den  

- **Processing Efficiency:** 25.0% (zpracováno do 24h)  

