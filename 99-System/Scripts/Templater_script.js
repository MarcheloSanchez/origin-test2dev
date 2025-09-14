// templates.js — robust frontmatter handling + explicit .md includes + notices
const ROOT = "Templates";
const TYPE_LAYOUT = { meta: "00.Meta.yaml.md", body: "10.Chapters.body.md" };

async function include(tp, path) { return await tp.file.include(`[[${path}]]`); }
function pathFor(type, kind) { return `${ROOT}/${type}/${type} - ${TYPE_LAYOUT[kind]}`; }

// detect + split YAML FM at file start; tolerant of BOM/whitespace
function splitFrontmatter(text) {
  const m = text.match(/^\uFEFF?\s*---\s*\n([\s\S]*?)\n---\s*\n?/);
  if (!m) return null;
  const front = text.slice(0, m[0].length);
  const rest  = text.slice(m[0].length);
  return { front, rest };
}

async function readActive() {
  const f = app.workspace.getActiveFile();
  if (!f) throw new Error("No active file");
  return await app.vault.read(f);
}
async function writeActive(s) {
  const f = app.workspace.getActiveFile();
  if (!f) throw new Error("No active file");
  return await app.vault.modify(f, s);
}

// 1) Add Meta — inject FM if missing
async function inject_meta_if_missing(tp, type) {
  const current = await readActive();
  const fm = splitFrontmatter(current);
  if (fm) { new Notice("AddMeta: frontmatter already exists — skipped"); return "exists"; }
  const meta = await include(tp, pathFor(type, "meta"));
  if (!meta?.trim()) { new Notice("AddMeta: meta template not found/empty"); return "no-meta"; }
  await writeActive(meta + "\n\n" + current);
  new Notice("AddMeta: injected");
  return "ok";
}

// 2) Add Chapters — add/replace body, preserve FM if present
async function add_chapters(tp, type) {
  const bodyTpl = await include(tp, pathFor(type, "body"));
  if (!bodyTpl?.trim()) { new Notice("AddChapters: body template not found/empty"); return "no-body"; }
  const current = await readActive();
  const fm = splitFrontmatter(current);
  if (!fm) {
    await writeActive(bodyTpl);
    new Notice("AddChapters: added (no YAML in note)");
    return "ok";
  }
  await writeActive(fm.front + "\n\n" + bodyTpl);
  new Notice("AddChapters: replaced body (kept YAML)");
  return "ok";
}

// 3) Create (empty/auto) — write meta + body
async function combine(tp, type, mode = "empty") {
  let meta = await include(tp, pathFor(type, "meta"));
  const body = await include(tp, pathFor(type, "body"));
  if (!meta?.trim() || !body?.trim()) {
    new Notice("Create: meta/body template missing"); return "missing";
  }
  if (mode === "auto") {
    // optional tweak example
    meta = meta.replace('status: "📥inbox"', 'status: "🔄active"');
  }
  await writeActive(meta + "\n\n" + body);
  new Notice(`Create: ${type} (${mode})`);
  return "ok";
}

// 4) Reset Body — keep YAML, replace body with template
async function reset_body(tp, type) {
  const bodyTpl = await include(tp, pathFor(type, "body"));
  if (!bodyTpl?.trim()) { new Notice("Reset: body template not found/empty"); return "no-body"; }
  const current = await readActive();
  const fm = splitFrontmatter(current);
  if (!fm) {
    await writeActive(bodyTpl);
    new Notice("Reset: set body (no YAML found)");
    return "ok";
  }
  await writeActive(fm.front + "\n\n" + bodyTpl);
  new Notice("Reset: replaced body (kept YAML)");
  return "ok";
}

// 5) ResetMeta → replace just the YAML, keep your current chapters.
async function reset_meta(tp, type) {
  const metaTpl = await include(tp, pathFor(type, "meta"));
  if (!metaTpl?.trim()) { new Notice("ResetMeta: meta template missing"); return "missing"; }

  const current = await readActive();
  const fm = splitFrontmatter(current);
  if (!fm) {
    await writeActive(metaTpl + "\n\n" + current);
    new Notice("ResetMeta: inserted meta (no YAML found)");
    return "ok";
  }
  await writeActive(metaTpl + "\n\n" + fm.rest);
  new Notice("ResetMeta: replaced YAML");
  return "ok";
}

// 6) Reset All  replace both YAML + chapters from the templates.
async function reset_all(tp, type, mode = "empty") {
  let metaTpl = await include(tp, pathFor(type, "meta"));
  const bodyTpl = await include(tp, pathFor(type, "body"));
  if (!metaTpl?.trim() || !bodyTpl?.trim()) { new Notice("ResetAll: meta/body template missing"); return "missing"; }
  if (mode === "auto") metaTpl = metaTpl.replace('status: "📥inbox"', 'status: "🔄active"');

  await writeActive(metaTpl + "\n\n" + bodyTpl);
  new Notice(`ResetAll: ${type} (${mode}) — YAML + chapters replaced`);
  return "ok";
}

module.exports = { inject_meta_if_missing, add_chapters, combine, reset_body };