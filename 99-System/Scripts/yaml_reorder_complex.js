/*
 * Robust YAML frontmatter re-order for Obsidian
 * - Preserves multi-line blocks, lists, comments, and line endings
 * - Only reorders EXISTING top-level keys to the baseOrder order
 * - Remaining keys keep original formatting and go alphabetically after baseOrder
 *
 * Usage (Templater): <%* tp.user.yaml_reorder() %>
 * Or as a QuickAdd User Script.
 */

module.exports = async () => {
  const { app } = window;

  const file = app.workspace.getActiveFile();
  if (!file) {
    new Notice("No active file.");
    return;
  }
  const content = await app.vault.read(file);

  // Detect and extract frontmatter
  const fmRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;
  const m = content.match(fmRegex);
  if (!m) {
    console.log("No YAML frontmatter in file:", file.basename);
    return;
  }

  const yamlBlock = m[1];
  const body = content.slice(m[0].length);
  const EOL = content.includes("\r\n") ? "\r\n" : "\n";

  // Expanded base order for your vault
  const baseOrder = [
    // Navigation
    "up", "in", "x",

    // Identity
    "title", "aliases", "fileClass", "cssclass", "type",

    // State
    "status", "maturity", "processing_priority",

    // Classification
    "tags",

    // Dates
    "created", "modified", "last_review", "review_frequency", "due", "start", "end",

    // Effort / Analytics
    "estimated_effort", "completeness", "coverage_areas", "linked_notes_count", "capture_method",

    // Relations
    "related", "see_also", "related_concepts", "related_ideas",

    // People (type: person)
    "role", "org", "company", "email", "phone", "website", "twitter", "github", "linkedin",
  ];

  // Split YAML into top-level key blocks, preserving formatting
  const lines = yamlBlock.split(/\r?\n/);
  const topKey = /^([A-Za-z0-9_.-]+)\s*:(.*)$/; // top-level keys must start at column 0
  let prefix = [];                 // comments/blank lines before first key
  let blocks = [];                 // [{ key, lines: [..] }]
  let current = null;
  let seenAnyKey = false;

  const flush = () => {
    if (current) blocks.push({ key: current.key, lines: current.lines.slice() });
    current = null;
  };

  for (const line of lines) {
    const isKeyLine = topKey.test(line) && !line.startsWith(" ");
    if (isKeyLine) {
      // New key starts; flush previous
      flush();
      const key = line.match(topKey)[1];
      current = { key, lines: [line] };
      seenAnyKey = true;
    } else {
      if (!seenAnyKey) {
        // Still in preamble (comments/blank lines before first key)
        prefix.push(line);
      } else {
        // Part of current block (indented lines, comments, blanks)
        if (!current) {
          // Defensive: if malformed, start a dummy block to avoid data loss
          current = { key: "_unknown", lines: [] };
        }
        current.lines.push(line);
      }
    }
  }
  flush();

  // Map of key -> raw block text
  const blockMap = new Map();
  const extras = []; // duplicate keys or unknowns fall back here to preserve bytes

  for (const b of blocks) {
    const raw = b.lines.join(EOL);
    if (b.key === "_unknown") { extras.push(raw); continue; }
    if (!blockMap.has(b.key)) blockMap.set(b.key, raw);
    else extras.push(raw); // preserve duplicates without reordering them into the main map
  }

  // Rebuild YAML in desired order
  const out = [];

  if (prefix.length) out.push(prefix.join(EOL));

  // Base-ordered keys first
  for (const k of baseOrder) {
    if (blockMap.has(k)) {
      out.push(blockMap.get(k));
      blockMap.delete(k);
    }
  }

  // Remaining keys alphabetical by key
  Array.from(blockMap.keys()).sort((a, b) => a.localeCompare(b))
    .forEach(k => out.push(blockMap.get(k)));

  // Any extras (duplicates/unknowns) appended verbatim at the end
  for (const raw of extras) out.push(raw);

  // Ensure trailing newline inside frontmatter
  let newYaml = out.join(EOL);
  if (newYaml.length && !newYaml.endsWith(EOL)) newYaml += EOL;

  const newContent = `---${EOL}${newYaml}---${EOL}${body}`;
  await app.vault.modify(file, newContent);

  new Notice("YAML reordered ✔︎");
  console.log("YAML reordered successfully:", file.basename);
};
