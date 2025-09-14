```javascript
// QuickAdd Macro: Batch-Tag-Updater
// Requires QuickAdd ≥0.9 + Dataview OFF
// CHANGE THIS TAGS. Left is EXACT MATCH to Right Side target
const tagMap = {
  "#meeting": "#context/meeting",
  "#idea": "#dots/idea",
  "#inbox": "#status/inbox"
};
const keepPrefix = true;               // set false for plain tags

const vault = app.vault;
const files = vault.getMarkdownFiles();

for (const f of files) {
  const fm = await quickAdd.api.frontmatter.getFrontmatter(f);
  if (!fm.tags) continue;              // skip tag-less notes
  let tags = fm.tags.map(t => t.toLowerCase());

  // 1. Rename via map
  tags = tags.map(t => tagMap[t] ?? t);

  // 2. Optional folder prefix (#projects/* etc.)
  if (keepPrefix) {
    const headFolder = f.path.split("/")[0].toLowerCase();
    tags = tags.map(t => t.includes("/")
        ? t                                // already namespaced
        : `#${headFolder}/${t.replace(/^#/, "")}`);
  }

  // 3. Dedup + sort
  tags = [...new Set(tags)].sort();

  // 4. Write back if changed
  if (JSON.stringify(tags) !== JSON.stringify(fm.tags)) {
    fm.tags = tags;
    await quickAdd.api.frontmatter.writeFrontmatter(f, fm);
    console.log(`✓ tags updated → ${f.path}`);
  }
}
```
