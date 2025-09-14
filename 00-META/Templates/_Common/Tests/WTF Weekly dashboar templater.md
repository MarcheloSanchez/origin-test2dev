<%
const today = moment();
const weekStart = today.clone().startOf('week');

let dashboard = `# Týdenní přehled (${weekStart.format('DD.MM')} - ${today.format('DD.MM')})\n\n`;

dashboard += `## Statistiky:\n`;
dashboard += `- Nové poznámky: ${newNotesCount}\n`;
dashboard += `- Dokončené úkoly: ${completedTasks}\n`;
dashboard += `- Aktivní projekty: ${activeProjects}\n\n`;

dashboard += `## Top tagy tohoto týdne:\n`;
dashboard += getTopTags().map(tag => `- ${tag}`).join('\n');

return dashboard;

%>