<%*
// 99-System/Templates/03 Efforts-Project.md
const projectName = await tp.system.prompt("Název projektu:");
const projectType = await tp.system.suggester(
  ["🏢 Pracovní", "🏠 Osobní", "📚 Vzdělávací", "🔬 Výzkum"],
  ["work", "personal", "education", "research"]
);
const deadline = await tp.system.prompt("Deadline (YYYY-MM-DD):");
const stakeholders = await tp.system.prompt("Stakeholders (oddělené čárkou):");

// Generování project ID
const projectId = projectName.toLowerCase().replace(/\s+/g, '-') + '-' + tp.date.now("YYYY-MM");

tR += `---
title: "${projectName}"
project_id: ${projectId}
type: ${projectType}
status: 🔄active
priority: medium
deadline: ${deadline}
created: ${tp.date.now("YYYY-MM-DD")}
stakeholders: [${stakeholders.split(',').map(s => `"${s.trim()}"`).join(', ')}]
completion: 0
---

# ${projectName}

## 🎯 Cíl projektu
<!-- Definujte hlavní cíl a očekávané výstupy -->

## 📋 Úkoly
- [ ] Definovat požadavky
- [ ] Vytvořit plán
- [ ] Implementace
- [ ] Testování
- [ ] Dokončení

## 🤝 Stakeholders
${stakeholders.split(',').map(s => `- [[${s.trim()}]]`).join('\n')}

## 📊 Pokrok
\`\`\`dataview
TASK
FROM "03-Efforts"
WHERE contains(file.name, "${projectId}")
GROUP BY completed
\`\`\`

## 📝 Poznámky
<!-- Průběžné poznámky k projektu -->

## 🔗 Související
- [[${tp.date.now("YYYY-MM-DD")}]] - Denní poznámka
`;
%>
