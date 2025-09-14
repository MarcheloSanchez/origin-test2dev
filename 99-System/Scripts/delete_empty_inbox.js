// delete-empty-inbox.mjs
module.exports = async (params) => {
  const { app, Notice } = window;
  // --- CONFIG ---
  const targetFolder = params?.folder || "+"; // e.g. "00 Inbox" if that’s your path
  const dryRun = params?.dryRun ?? true;          // set to false to actually delete
  // --------------

  const mdFiles = app.vault.getMarkdownFiles();
  const inFolder = (f) => f.path.startsWith(targetFolder + "/") || f.path === `${targetFolder}.md`;

  const isUntitled = (name) => /^Untitled(\s\d+)?$/i.test(name);
  const deletions = [];

  for (const file of mdFiles.filter(inFolder)) {
    const base = file.basename;
    const isUntitledFile = isUntitled(base);
    let isEmpty = false;

    try {
      const data = await app.vault.read(file);
      isEmpty = data.trim().length === 0;
    } catch (e) {
      // If cannot read for some reason, skip
      continue;
    }

    if (isEmpty || isUntitledFile) {
      deletions.push(file);
    }
  }

  if (deletions.length === 0) {
    new Notice(`🧹 Inbox clean — nothing to delete in "${targetFolder}".`);
    return;
  }

  if (dryRun) {
    new Notice(`🔍 Dry run: ${deletions.length} file(s) would be deleted. (Set dryRun=false to apply)`);
    console.log("Dry run deletions:", deletions.map(f => f.path));
    return;
  }

  for (const f of deletions) {
    try { await app.vault.delete(f); } catch(e) { /* ignore */ }
  }

  new Notice(`🗑️ Deleted ${deletions.length} empty/Untitled file(s) from "${targetFolder}".`);
};
