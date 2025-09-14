// templates.js — 4 actions for all types (Obsidian vault API)
const ROOT = "Templates";
const TYPE_LAYOUT = { meta: "00.Meta.yaml", body: "10.Chapters.body" };

async function include(tp, path){ return await tp.file.include(`[[${path}]]`); }
function pathFor(type, kind){ return `${ROOT}/${type}/${type} - ${TYPE_LAYOUT[kind]}`; }

function hasFM(text){
  const s = text.trimStart();
  if (!s.startsWith('---')) return false;
  const j = s.indexOf('---', 3);
  return j !== -1;
}
function splitFM(text){
  const i = text.indexOf('---');            // assumes starts with '---'
  const j = text.indexOf('---', i + 3);
  const front = text.slice(0, j + 3);
  const body  = text.slice(j + 3).trimStart();
  return { front, body };
}
async function readActive(){ return await app.vault.read(app.workspace.getActiveFile()); }
async function writeActive(s){ return await app.vault.modify(app.workspace.getActiveFile(), s); }

// 1) Add Meta — inject frontmatter if missing
async function inject_meta_if_missing(tp, type){
  const current = await readActive();
  if (hasFM(current)) return "Meta exists";
  const meta = await include(tp, pathFor(type, "meta"));
  await writeActive(meta + "\n\n" + current);
  return "Meta injected";
}

// 2) Add Chapters — add/replace body without touching YAML
async function add_chapters(tp, type){
  const bodyTpl = await include(tp, pathFor(type, "body"));
  const current = await readActive();
  if (!hasFM(current)){
    await writeActive(bodyTpl);
    return "Chapters added (no YAML found)";
  }
  const { front } = splitFM(current);
  await writeActive(front + "\n\n" + bodyTpl);
  return "Chapters added";
}

// 3) Create (empty/auto) — write meta + body
async function combine(tp, type, mode="empty"){
  let meta = await include(tp, pathFor(type, "meta"));
  const body = await include(tp, pathFor(type, "body"));
  if (mode === "auto"){
    // example tweak (optional):
    meta = meta.replace('status: "📥inbox"', 'status: "🔄active"');
  }
  await writeActive(meta + "\n\n" + body);
  return `Combined (${mode})`;
}

// 4) Reset Body — keep YAML, replace body with template
async function reset_body(tp, type){
  const bodyTpl = await include(tp, pathFor(type, "body"));
  const current = await readActive();
  if (!hasFM(current)){
    await writeActive(bodyTpl);
    return "Body reset (no YAML found)";
  }
  const { front } = splitFM(current);
  await writeActive(front + "\n\n" + bodyTpl);
  return "Body reset";
}

module.exports = { inject_meta_if_missing, add_chapters, combine, reset_body };