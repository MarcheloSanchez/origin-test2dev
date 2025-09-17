// report_stale_notes.js
// QuickAdd-compatible script that lists notes older than the configured threshold.
// Params (via QuickAdd Arguments JSON, all optional):
//   {
//     "days": 45,            // Age threshold in days (defaults to 30)
//     "folder": "02-PARA",  // Limit scan to a folder (defaults to entire vault)
//     "logNote": "99-System/Reports/Stale Notes Log.md", // Append report to this note
//     "openLog": true        // Open the log note after writing (defaults to false)
//   }

module.exports = async (params = {}) => {
  const { app, Notice } = window;

  const DAY_MS = 24 * 60 * 60 * 1000;
  const ensurePositiveNumber = (value, fallback) => {
    const num = Number(value);
    return Number.isFinite(num) && num > 0 ? num : fallback;
  };

  const days = ensurePositiveNumber(params.days ?? params.thresholdDays ?? params.threshold ?? 30, 30);
  const thresholdMs = days * DAY_MS;
  const folder = typeof params.folder === "string" ? params.folder.trim() : "";
  const rawLogPath = typeof params.logNote === "string" ? params.logNote.trim() : "";
  const openLog = params.openLog === true;

  let logNotePath = rawLogPath;
  let addDefaultTitle = false;
  if (logNotePath && !logNotePath.endsWith(".md")) {
    addDefaultTitle = true;
    logNotePath = `${logNotePath.replace(/\/+$/, "")}.md`;
  }

  const now = Date.now();
  const markdownFiles = app.vault.getMarkdownFiles();

  const inFolderScope = (file) => {
    if (!folder) return true;
    if (!file?.path) return false;
    const normalized = folder.replace(/\/+$/, "");
    if (!normalized) return true;
    const withSlash = `${normalized}/`;
    return file.path === `${normalized}.md` || file.path === normalized || file.path.startsWith(withSlash);
  };

  const formatAge = (ms) => {
    const daysFloat = ms / DAY_MS;
    if (daysFloat >= 1) return `${daysFloat.toFixed(1)}d`;
    const hoursFloat = ms / (60 * 60 * 1000);
    if (hoursFloat >= 1) return `${hoursFloat.toFixed(1)}h`;
    const minutesFloat = ms / (60 * 1000);
    if (minutesFloat >= 1) return `${minutesFloat.toFixed(1)}m`;
    return `${Math.max(Math.round(ms / 1000), 0)}s`;
  };

  const formatDate = (ms) => {
    try {
      return new Date(ms).toISOString().replace("T", " ").split(".")[0];
    } catch (e) {
      return "Unknown";
    }
  };

  const stale = [];
  for (const file of markdownFiles) {
    if (!inFolderScope(file)) continue;
    const mtime = file?.stat?.mtime;
    if (!mtime) continue;
    const age = now - mtime;
    if (age >= thresholdMs) {
      stale.push({ file, age, mtime });
    }
  }

  stale.sort((a, b) => {
    if (b.age === a.age) return a.file.path.localeCompare(b.file.path);
    return b.age - a.age;
  });

  if (stale.length === 0) {
    const message = `✅ No notes older than ${days} day(s)${folder ? ` in "${folder}"` : ""}.`;
    new Notice(message, 4000);
    console.log(message);
    return;
  }

  const lines = stale.map((entry, index) => {
    const number = String(index + 1).padStart(2, "0");
    const ageStr = formatAge(entry.age);
    const lastMod = formatDate(entry.mtime);
    return `${number}. ${entry.file.path} — ${ageStr} old (last modified ${lastMod})`;
  });

  console.group(`🗒️ Stale notes (> ${days} day${days === 1 ? "" : "s"})${folder ? ` — Folder: ${folder}` : ""}`);
  lines.forEach(line => console.log(line));
  console.groupEnd();

  if (logNotePath) {
    const EOL = "\n";
    const header = `## Report — ${new Date().toISOString()} (>${days} day${days === 1 ? "" : "s"})`;
    const body = lines
      .map((line, idx) => {
        const entry = stale[idx];
        const wiki = entry.file.path.replace(/\.md$/i, "");
        return `- [[${wiki}]] — ${formatAge(entry.age)} old (last modified ${formatDate(entry.mtime)})`;
      })
      .join(EOL);
    const report = `${header}${EOL}Total: ${stale.length}${folder ? `${EOL}Folder: ${folder}` : ""}${EOL}${EOL}${body}${EOL}`;

    const existing = app.vault.getAbstractFileByPath(logNotePath);
    try {
      if (!existing) {
        const title = addDefaultTitle ? "# Stale Notes Log" + EOL + EOL : "";
        await app.vault.create(logNotePath, `${title}${report}`);
      } else if (existing.children) {
        new Notice(`⚠️ Log note path points to a folder: ${logNotePath}`);
      } else {
        const prev = await app.vault.read(existing);
        const nextContent = prev.trim().length ? `${prev.trimEnd()}${EOL}${EOL}${report}` : report;
        await app.vault.modify(existing, nextContent);
      }

      if (openLog) {
        try {
          const link = logNotePath.replace(/\.md$/i, "");
          await app.workspace.openLinkText(link, "", false);
        } catch (e) {
          console.warn("Could not open log note", e);
        }
      }
    } catch (error) {
      console.error("Failed to write stale notes report", error);
      new Notice(`❌ Failed to write report to ${logNotePath}`);
    }
  }

  new Notice(`Found ${stale.length} stale note(s) older than ${days} day(s).`, 5000);
};
