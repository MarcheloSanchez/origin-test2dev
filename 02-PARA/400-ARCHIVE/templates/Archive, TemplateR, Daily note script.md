<%*
// 99-System/Templates/Daily-Note-Smart.md
const today = tp.date.now("YYYY-MM-DD");
const dayName = tp.date.now("dddd", "cs");
const weekNumber = tp.date.now("WW");

// Načtení nedokončených úkolů z předchozího dne
const yesterday = tp.date.now("YYYY-MM-DD", -1);
const yesterdayFile = tp.file.find_tfile(yesterday);

let carryOverTasks = "";
if (yesterdayFile) {
  const yesterdayContent = await app.vault.read(yesterdayFile);
  const incompleteTasks = yesterdayContent.match(/- \[ \] .*/g);
  if (incompleteTasks) {
    carryOverTasks = "## 📋 Přenesené úkoly\n" + 
                    incompleteTasks.map(task => task + " ⏰").join('\n');
  }
}

tR += `---
title: "${today}"
date: ${today}
day: ${dayName}
week: ${weekNumber}
type: daily
tags: [#daily, #${tp.date.now("YYYY")}, [[week-]]${weekNumber}]
---

# ${dayName}, ${tp.date.now("DD.MM.YYYY")}

## 🎯 Dnešní priority
- [ ] 
- [ ] 
- [ ] 

${carryOverTasks}

## 📥 Rychlé zachycení
<!-- Místo pro rychlé poznámky během dne -->

## 🔄 Aktivní projekty
\`\`\`dataview
TABLE status, priority, deadline
FROM "03 Efforts"
WHERE status = "🔄active"
SORT priority DESC, deadline ASC
LIMIT 5
\`\`\`

## 📝 Poznámky
<!-- Detailní poznámky z dnešního dne -->

## 🎉 Dokončeno
- [ ] 

---
*Vytvořeno: ${tp.date.now("HH:mm")}*
`;
%>
[[🌱develop]] 