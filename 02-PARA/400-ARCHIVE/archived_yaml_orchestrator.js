/*
 * YAML Orchestrator (type-agnostic) for Obsidian
 * Modes:
 *   - "reorder"   : safe, preserves formatting/comments (moves whole key blocks)
 *   - "normalize" : fixes values (arrays/dates/enums/renames) and rewrites YAML (comments lost)
 *   - "lint"      : report-only; writes a Markdown report with issues
 *
 * Args (JSON):
 *   { mode: "reorder"|"normalize"|"lint",
 *     path?: "relative/file.md",
 *     folder?: "folder/path",
 *     dryRun?: true,
 *     backup?: true|false,
 *     configPath?: "99 System/Config/yaml-meta-config.json" }
 *
 * Usage (Templater):
 *   <%* await tp.user.yaml_orchestrator({ mode: "reorder" }) %>
 *   <%* await tp.user.yaml_orchestrator({ mode: "normalize", backup: true }) %>
 *   <%* await tp.user.yaml_orchestrator({ mode: "lint", folder: "03 Efforts" }) %>
 *
 * Usage (QuickAdd User Script): set Arguments to a JSON string, e.g. {"mode":"reorder"}
 */
module.exports = async (rawArgs) => {
  // ---- Arg parsing (supports QuickAdd passing a JSON string) ----
  let args = rawArgs || {};
  if (typeof args === "string") {
    try { args = JSON.parse(args || "{}"); } catch { args = {}; }
  }
  const { app } = window;

  const mode = (args.mode || "reorder").toLowerCase();
  const targetPath = args.path || null;       // run on this file path
  const folder = args.folder || null;         // or run on all .md in folder
  const dryRun = !!args.dryRun;
  const doBackup = args.backup !== false;     // default true for normalize
  const CONFIG_PATH = args.configPath || "99-System/Config/yaml-meta-config.json";

  // ---- Utils ----
  const tsStamp = () => {
    const d = new Date();
    const p = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}${p(d.getMonth()+1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
  };

  const listMarkdownFiles = async (dir) => {
    const out = [];
    const walk = async (p) => {
      try {
        const { files, folders } = await app.vault.adapter.list(p);
        for (const f of files) if (f.endsWith(".md")) out.push(f);
        for (const d of folders) await walk(d);
      } catch {
        // ignore missing folders
      }
    };
    await walk(dir);
    return out;
  };

  const readConfig = async () => {
    // Defaults — type-agnostic (no per-type order)
    const defaults = {
      order: {
        "default": [
          // Navigation
          "up","in","x",
          // Identity
          "title","aliases","fileClass","cssclass","type",
          // State
          "status","maturity","processing_priority",
          // Classification
          "tags",
          // Dates
          "created","modified","last_review","review_frequency","due","start","end",
          // Effort/Analytics
          "estimated_effort","completeness","coverage_areas","linked_notes_count","capture_method",
          // Relations
          "related","see_also","related_concepts","related_ideas",
          // Common person/org identifiers (kept here but not required)
          "role","org","company","email","phone","website","twitter","github","linkedin"
        ]
      },
      enums: {
        status: ["inbox","active","waiting","completed","archived"]
      },
      toArray: ["tags","aliases"],
      dateKeys: ["created","modified","last_review","review_frequency","due","start","end"],
      rules: {
        tags: { stripHashes: true, lowerCase: false, sort: true, dedupe: true, trim: true },
        aliases: { dedupe: true, sort: false, trim: true },
        rename: { "seeAlso": "see_also", "relatedNotes": "related" },
        ensureRequired: ["title","type","status","created"],
        removeEmpty: true
      }
    };

    try {
      if (await app.vault.adapter.exists(CONFIG_PATH)) {
        const raw = await app.vault.adapter.read(CONFIG_PATH);
        const cfg = JSON.parse(raw);
        // shallow-merge with defaults
        return Object.assign({}, defaults, cfg, {
          order: Object.assign({}, defaults.order, cfg.order || {}),
          enums: Object.assign({}, defaults.enums, cfg.enums || {}),
          rules: Object.assign({}, defaults.rules, cfg.rules || {})
        });
      }
    } catch (e) { console.warn("Config parse error:", e); }
    return defaults;
  };

  // ---- Engine A: Reorder-only (format-preserving) ----
  const reorderOnly = async (file, cfg) => {
    const content = await app.vault.read(file);
    const fmRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;
    const m = content.match(fmRegex);
    if (!m) return { skipped: true, reason: "no-frontmatter" };

    const yamlBlock = m[1];
    const body = content.slice(m[0].length);
    const EOL = content.includes("\r\n") ? "\r\n" : "\n";

    const lines = yamlBlock.split(/\r?\n/);
    const topKey = /^([A-Za-z0-9_.-]+)\s*:(.*)$/; // key at column 0
    let prefix = [], blocks = [], current = null, seen = false;

    const flush = () => { if (current) blocks.push({ key: current.key, lines: current.lines.slice() }); current = null; };

    for (const line of lines) {
      const isKey = topKey.test(line) && !line.startsWith(" ");
      if (isKey) {
        flush();
        const key = line.match(topKey)[1];
        current = { key, lines: [line] };
        seen = true;
      } else {
        if (!seen) prefix.push(line);
        else { if (!current) current = { key: "_unknown", lines: [] }; current.lines.push(line); }
      }
    }
    flush();

    const blockMap = new Map();
    const extras = [];
    for (const b of blocks) {
      const raw = b.lines.join(EOL);
      if (b.key === "_unknown") { extras.push(raw); continue; }
      if (!blockMap.has(b.key)) blockMap.set(b.key, raw); else extras.push(raw); // keep duplicates as extras
    }

    const order = cfg.order.default || [];
    const out = [];
    if (prefix.length) out.push(prefix.join(EOL));
    for (const k of order) if (blockMap.has(k)) { out.push(blockMap.get(k)); blockMap.delete(k); }
    Array.from(blockMap.keys()).sort().forEach(k => out.push(blockMap.get(k)));
    for (const raw of extras) out.push(raw);

    let newYaml = out.join(EOL);
    if (newYaml.length && !newYaml.endsWith(EOL)) newYaml += EOL;
    const newContent = `---${EOL}${newYaml}---${EOL}${body}`;

    if (!dryRun && newContent !== content) await app.vault.modify(file, newContent);
    return { changed: newContent !== content };
  };

  // ---- Helpers for normalize ----
  const asArray = (v) => Array.isArray(v) ? v : (v == null || v === "" ? [] : [v]);
  const normalizeArray = (v, opts = {}) => {
    let arr = asArray(v).map(x => (x == null ? "" : String(x)));
    if (opts.stripHashes) arr = arr.map(x => x.replace(/^#/, ""));
    if (opts.trim) arr = arr.map(x => x.trim()).filter(x => x.length);
    if (opts.lowerCase) arr = arr.map(x => x.toLowerCase());
    if (opts.dedupe) arr = Array.from(new Set(arr));
    if (opts.sort) arr = arr.slice().sort((a,b) => a.localeCompare(b));
    return arr;
  };
  const parseToYMD = (val) => {
    if (!val) return null;
    const iso = /^\d{4}-\d{2}-\d{2}$/;
    if (iso.test(String(val))) return String(val);
    const d = new Date(val);
    if (isNaN(d)) return null;
    return d.toISOString().slice(0,10);
  };
  const yamlScalar = (v) => {
    if (typeof v === "boolean" || typeof v === "number") return String(v);
    if (v == null) return "";
    const s = String(v);
    return /[:#>\-\[\]\{\},&*!|'"%@`]|^\s|\s$/.test(s) ? `"${s.replace(/"/g,'\\"')}"` : s;
  };
  const yamlValue = (v, indent = "") => {
    if (Array.isArray(v)) {
      if (v.length === 0) return "[]";
      return "\n" + v.map(x => `${indent}- ${yamlScalar(x)}`).join("\n");
    } else if (v && typeof v === "object") {
      const keys = Object.keys(v);
      if (keys.length === 0) return "{}";
      return "\n" + keys.map(k => `${indent}${k}: ${yamlValue(v[k], indent + "  ")}`).join("\n");
    } else {
      return yamlScalar(v);
    }
  };

  // ---- Engine B: Normalize & rewrite (lossy formatting) ----
  const normalizeAndRewrite = async (file, cfg) => {
    const content = await app.vault.read(file);
    const fmRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;
    const m = content.match(fmRegex);
    if (!m) return { skipped: true, reason: "no-frontmatter" };
    const originalYaml = m[1];
    const body = content.slice(m[0].length);

    // Use Obsidian's parsed frontmatter (comments/formatting lost)
    const cache = app.metadataCache.getFileCache(file);
    const fm = cache?.frontmatter ? { ...cache.frontmatter } : null;
    if (!fm) return { skipped: true, reason: "no-frontmatter-object" };

    // Strip internal keys
    for (const k of ["position","frontmatterLinks","headings"]) delete fm[k];

    // 1) Renames
    const rules = cfg.rules || {};
    if (rules.rename) {
      for (const [from, to] of Object.entries(rules.rename)) {
        if (fm[from] != null && fm[to] == null) { fm[to] = fm[from]; delete fm[from]; }
      }
    }

    // 2) Arrays & hygiene
    if ("tags" in fm) fm.tags = normalizeArray(fm.tags, rules.tags || {});
    if ("aliases" in fm) fm.aliases = normalizeArray(fm.aliases, rules.aliases || {});
    for (const k of (cfg.toArray || [])) if (k in fm) fm[k] = asArray(fm[k]);

    // 3) Status enum (lowercased)
    if (fm.status && typeof fm.status === "string") {
      const low = fm.status.toLowerCase().trim();
      const allowed = cfg.enums?.status || [];
      const map = { "done":"completed", "complete":"completed", "finished":"completed", "archive":"archived" };
      fm.status = allowed.includes(low) ? low : (map[low] || low);
    }

    // 4) Dates → YYYY-MM-DD; fill created from file stat if missing
    const statFile = app.vault.getAbstractFileByPath(file.path);
    if (!fm.created && statFile?.stat?.ctime) {
      const d = new Date(statFile.stat.ctime);
      fm.created = d.toISOString().slice(0,10);
    }
    for (const k of (cfg.dateKeys || [])) {
      if (!fm[k]) continue;
      const ymd = parseToYMD(fm[k]);
      if (ymd) fm[k] = ymd;
    }

    // 5) Ensure required keys exist (empty if missing)
    const required = rules.ensureRequired || [];
    for (const k of required) if (!(k in fm)) fm[k] = "";

    // 6) Remove empties (optional)
    if (rules.removeEmpty) {
      for (const k of Object.keys(fm)) {
        if (fm[k] === "" || (Array.isArray(fm[k]) && fm[k].length === 0)) delete fm[k];
      }
    }

    // Build ordered YAML
    const order = cfg.order.default || [];
    const keys = new Set(Object.keys(fm));
    let y = "";
    for (const k of order) {
      if (keys.has(k)) { y += `${k}: ${yamlValue(fm[k], "  ")}\n`; keys.delete(k); }
    }
    const rest = Array.from(keys).sort();
    for (const k of rest) y += `${k}: ${yamlValue(fm[k], "  ")}\n`;

    const EOL = content.includes("\r\n") ? "\r\n" : "\n";

    // old_Backup original YAML (if not dry-run and backups enabled)
	// Snapshot original YAML into a Markdown file (default ON unless backup:false)
	if (mode === "normalize" && !dryRun && doBackup) {
	  const snapshotDir = "_backups/normalize-snapshots";
	  try {
		if (!(await app.vault.adapter.exists(snapshotDir))) {
		  await app.vault.adapter.mkdir(snapshotDir);
		}
	  } catch (e) { /* ignore */ }

	  const safeName = file.path.replace(/[\\/]/g, "__").replace(/\.md$/i, "");
	  const EOL = content.includes("\r\n") ? "\r\n" : "\n";

	  const snapshot = [
		`---`,
		originalYaml,              // <- captured earlier: const originalYaml = m[1];
		`---`,
		`**Source:** [[${file.path}]]`,
		`**When:** ${new Date().toISOString()}`,
		`**Mode:** normalize snapshot`,
		``
	  ].join(EOL);

	  const snapPath = `${snapshotDir}/${safeName}.${tsStamp()}.md`;
	  await app.vault.adapter.write(snapPath, snapshot);
	}


    // Dry-run preview note
    if (dryRun) {
      const previewPath = `99-System/Reports/Preview - ${file.basename} (${tsStamp()}).md`;
      const preview = [
        "# YAML Normalize Preview",
        `**File:** [[${file.path}]]`,
        "",
        "## Before",
        "```yaml",
        originalYaml,
        "```",
        "",
        "## After",
        "```yaml",
        y.trimEnd(),
        "```"
      ].join(EOL);
      await app.vault.create(previewPath, preview);
      return { changed: true, rewritten: true, preview: previewPath };
    }

    const newContent = `---${EOL}${y}---${EOL}${body}`;
    if (newContent !== content) await app.vault.modify(file, newContent);
    return { changed: newContent !== content, rewritten: true };
  };

  // ---- Engine C: Lint (report-only) ----
  const lintOnly = async (file, cfg) => {
    const cache = app.metadataCache.getFileCache(file);
    const fm = cache?.frontmatter;
    const issues = [];
    if (!fm) {
      issues.push("no frontmatter");
      return { file, issues };
    }

    // Arrays
    for (const k of (cfg.toArray || [])) {
      if (k in fm && !Array.isArray(fm[k])) issues.push(`"${k}" is not an array`);
    }

    // Status enum
    if (fm.status && !(cfg.enums?.status || []).includes(String(fm.status).toLowerCase()))
      issues.push(`status "${fm.status}" not in enum`);

    // Dates parseable
    for (const k of (cfg.dateKeys || [])) {
      if (fm[k] && !parseToYMD(fm[k])) issues.push(`date "${k}" not parseable: ${fm[k]}`);
    }

    // Required
    const req = cfg.rules?.ensureRequired || [];
    for (const k of req) if (!(k in fm)) issues.push(`missing required "${k}"`);

    return { file, issues };
  };

  // ---- Gather files ----
  const files = [];
  if (folder) {
    files.push(...await listMarkdownFiles(folder));
  } else if (targetPath) {
    files.push(targetPath);
  } else {
    const f = app.workspace.getActiveFile();
    if (!f) { new Notice("No active file."); return; }
    files.push(f.path);
  }

  const cfg = await readConfig();

  // ---- Run requested mode ----
  if (mode === "lint") {
    const allIssues = [];
    for (const p of files) {
      const af = app.vault.getAbstractFileByPath(p);
      if (!af || af.children) continue;
      const res = await lintOnly(af, cfg);
      if (res && res.issues.length) allIssues.push(res);
    }
    const EOL = "\n";
    const report = [];
    const total = allIssues.reduce((acc, r) => acc + r.issues.length, 0);
    report.push(`# YAML Lint Report — ${new Date().toISOString().slice(0,10)}`);
    report.push(`**Issues found:** ${total}`);
    for (const r of allIssues) {
      report.push(`\n## [[${r.file.path}]]`);
      for (const msg of r.issues) report.push(`- ${msg}`);
    }
    const outPath = `99-System/Reports/YAML Lint — ${tsStamp().slice(0,8)}.md`;
    await app.vault.create(outPath, report.join(EOL));
    new Notice(`Lint complete: ${total} issue(s). See ${outPath}`);
    console.log("Lint report:", outPath);
    return;
  }

  let changed = 0, skipped = 0;
  for (const p of files) {
    const af = app.vault.getAbstractFileByPath(p);
    if (!af || af.children) continue;
    const file = af;
    let res;
    if (mode === "normalize") res = await normalizeAndRewrite(file, cfg);
    else res = await reorderOnly(file, cfg);
    if (res?.changed) changed++; else skipped++;
  }

  const label = mode === "normalize" ? "Normalized" : "Reordered";
  new Notice(`${label} ${changed} file(s). Skipped ${skipped}. ${dryRun ? "(dry-run)" : ""}`);
  console.log(`${label} ${changed} file(s). Skipped ${skipped}. ${dryRun ? "(dry-run)" : ""}`);
};
