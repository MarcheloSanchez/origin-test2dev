<%*  

const dv = app.plugins.plugins["dataview"].api;  

const vault = app.vault;  

const moment = window.moment;  

  

// === Parametry časového rozsahu ===  

const today = moment();  

const start = today.clone().subtract(6, "days");  

const end = today.clone();  

  

// === Cílová složka s denními poznámkami ===  

const pages = dv.pages('"05 Calendar/Daily"')  

.where(p => p.file.day >= start && p.file.day <= end)  

.sort(p => p.file.day, 'asc');  

  

let output = `# 🗓 Shrnutí týdne ${start.format("YYYY-MM-DD")} – ${end.format("YYYY-MM-DD")}\n\n`;  

  

for (const page of pages) {  

const filePath = page.file.path;  

const fileObj = vault.getAbstractFileByPath(filePath);  

if (!fileObj) continue;  

  

const fileContent = await vault.read(fileObj);  

  

const getSection = (title) => {  

const regex = new RegExp(`###\\s*${title}[\\s\\S]*?(?=\\n###|\\n##|$)`, "i");  

const match = fileContent.match(regex);  

return match ? match[0].replace(/###.*\n/, "").trim() : "";  

};  

  

const gratitude = getSection("🌞 Za co jsem vděčný\\?");  

const insight = getSection("🧠 Co mě zaujalo\\/naučilo\\?");  

const emotion = getSection("💭 Emoce zažita\\?");  

const highlight = page.highlight ?? "";  

  

output += `## 📅 ${page.file.day.toFormat("YYYY-MM-DD")} ([[${page.file.name}]])\n`;  

if (highlight) output += `- ✨ highlight:: ${highlight}\n`;  

if (gratitude) output += `- 🌞 Vděčnost: ${gratitude}\n`;  

if (insight) output += `- 🧠 Poznatek: ${insight}\n`;  

if (emotion) output += `- 💭 Emoce: ${emotion}\n`;  

output += `\n`;  

}  

  

output += `---\n\n## ✍️ Reflexe týdne\n- Co se povedlo:\n- Co bych chtěl změnit:\n- Co chci zkusit příští týden:\n`;  

  

tR += output;  

%>