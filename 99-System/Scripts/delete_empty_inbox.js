#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const fsp = fs.promises;

const hasWindow = typeof window !== "undefined" && window !== null;
const DEFAULT_FOLDER = "+";
const DEFAULT_BACKUP_FOLDER = "99-System/_backups/delete_empty_inbox";

const REASON_LABELS = {
  "empty-content": "Empty content (only whitespace)",
  "untitled-name": "Filename matches the default Untitled pattern"
};

function normalisePath(filepath) {
  return filepath.replace(/\\/g, "/");
}

function trimSlashes(value) {
  return value.replace(/[\\/]+$/, "");
}

function collectList(input) {
  const out = [];
  const visit = (value) => {
    if (value == null) return;
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (!trimmed) return;
      if (trimmed.includes(",")) {
        trimmed.split(",").forEach(segment => visit(segment));
        return;
      }
      out.push(trimSlashes(normalisePath(trimmed)) || ".");
    }
  };
  visit(input);
  return out.filter(Boolean);
}

function dedupe(list) {
  return [...new Set(list)];
}

function parseMode(modeValue, dryRunValue) {
  const raw = typeof modeValue === "string" ? modeValue.trim().toLowerCase() : null;
  if (raw === "apply" || raw === "run" || raw === "delete") return "apply";
  if (raw === "dry-run" || raw === "dryrun" || raw === "dry" || raw === "preview") return "dry-run";
  if (typeof dryRunValue === "boolean") {
    return dryRunValue ? "dry-run" : "apply";
  }
  return "dry-run";
}

function parseBoolean(value, fallback = false) {
  if (value === undefined) return fallback;
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") {
    const normalised = value.trim().toLowerCase();
    if (["1", "true", "yes", "y", "on"].includes(normalised)) return true;
    if (["0", "false", "no", "n", "off"].includes(normalised)) return false;
  }
  return fallback;
}

function parseRawParams(raw) {
  if (raw == null) return {};
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw);
    } catch (error) {
      console.warn("[delete_empty_inbox] Unable to parse parameters string as JSON:", error.message);
      return {};
    }
  }
  if (typeof raw === "object") return { ...raw };
  return {};
}

function resolveApp(contextApp) {
  if (contextApp && typeof contextApp === "object") return contextApp;
  if (hasWindow && window.app) return window.app;
  throw new Error("delete_empty_inbox requires access to Obsidian's app (provide context.app when running outside Obsidian).");
}

function resolveNotice(contextNotice) {
  if (contextNotice) return contextNotice;
  if (hasWindow && typeof window.Notice === "function") return window.Notice;
  return class ConsoleNotice {
    constructor(message) {
      console.log(`[Notice] ${message}`);
    }
  };
}

function safeResolve(basePath, targetPath, label) {
  if (!targetPath) return null;
  if (path.isAbsolute(targetPath)) return targetPath;
  if (!basePath) {
    console.warn(`[delete_empty_inbox] Unable to resolve ${label || "path"} "${targetPath}" without a vault root; skipping.`);
    return null;
  }
  return path.join(basePath, targetPath);
}

function buildOptions(rawParams, context, app) {
  const params = parseRawParams(rawParams);

  const includes = collectList(
    params.targetsInclude ??
    params.include ??
    params.includes ??
    (params.folder ? [params.folder] : [])
  );
  if (includes.length === 0) includes.push(DEFAULT_FOLDER);

  const excludes = collectList(params.targetsExclude ?? params.exclude ?? params.excludes ?? []);

  const mode = parseMode(params.mode, params.dryRun);
  const backups = parseBoolean(params.backups ?? params.backup, mode === "apply");
  const emitNotice = params.silent ? false : params.emitNotice !== false;
  const approvalToken = typeof params.approvalToken === "string"
    ? params.approvalToken.trim()
    : (typeof params.approved === "string" ? params.approved.trim() : null);

  const adapterBase = context?.vaultRoot || app?.vault?.adapter?.basePath || app?.vault?.adapter?.basePathInternal;
  const vaultRoot = params.vaultRoot ? safeResolve(adapterBase || process.cwd(), params.vaultRoot, "vaultRoot") : adapterBase || null;

  const logPath = typeof params.logPath === "string" && params.logPath.trim() ? params.logPath.trim() : null;
  const logPathAbs = logPath ? safeResolve(vaultRoot, logPath, "log path") : null;

  const backupFolder = typeof params.backupFolder === "string" && params.backupFolder.trim()
    ? params.backupFolder.trim()
    : DEFAULT_BACKUP_FOLDER;
  const backupDir = mode === "apply" ? safeResolve(vaultRoot, backupFolder, "backup folder") : null;

  const timestamp = new Date();
  const runStamp = formatTimestamp(timestamp);

  return {
    params,
    includes: dedupe(includes),
    excludes: dedupe(excludes),
    mode,
    backups,
    emitNotice,
    approvalToken,
    logPath,
    logPathAbs,
    backupDir,
    vaultRoot,
    timestamp,
    runStamp
  };
}

function formatTimestamp(date) {
  const d = date || new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

function isUntitled(basename) {
  return /^Untitled(\s+\d+)?$/i.test(basename || "");
}

function matchesFolders(filePath, includes, excludes) {
  const inTarget = includes.some(folder => filePath === folder || filePath.startsWith(`${folder}/`));
  if (!inTarget) return false;
  const isExcluded = excludes.some(folder => filePath === folder || filePath.startsWith(`${folder}/`));
  return !isExcluded;
}

async function evaluateFile(app, file) {
  let content;
  try {
    content = await app.vault.read(file);
  } catch (error) {
    throw new Error(`Unable to read ${file.path}: ${error.message}`);
  }

  const trimmed = content.replace(/^\uFEFF/, "").trim();
  if (trimmed.length > 0) return null;

  const reasons = ["empty-content"];
  if (isUntitled(file.basename || path.basename(file.path, path.extname(file.path)))) {
    reasons.push("untitled-name");
  }

  return {
    file,
    path: normalisePath(file.path),
    basename: file.basename || path.basename(file.path, path.extname(file.path)),
    reasons,
    size: content.length
  };
}

async function ensureDir(dirPath) {
  if (!dirPath) return;
  await fsp.mkdir(dirPath, { recursive: true });
}

async function writeLog(options, data) {
  if (!options.logPathAbs) return null;
  const logContent = buildLogContent(options, data);
  await ensureDir(path.dirname(options.logPathAbs));
  await fsp.writeFile(options.logPathAbs, logContent, "utf8");
  return options.logPathAbs;
}

function buildLogContent(options, data) {
  const { includes, excludes, mode, backups, timestamp, runStamp } = options;
  const { candidates, deleted, scanned, errors } = data;

  const lines = [];
  lines.push(`# delete_empty_inbox report (${mode})`);
  lines.push("");
  lines.push(`- Timestamp: ${timestamp.toISOString()}`);
  lines.push(`- Run ID: ${runStamp}`);
  lines.push(`- Mode: ${mode}`);
  lines.push(`- Backups enabled: ${backups ? "yes" : "no"}`);
  lines.push(`- Targets include: ${includes.length ? includes.join(", ") : "(none)"}`);
  lines.push(`- Targets exclude: ${excludes.length ? excludes.join(", ") : "(none)"}`);
  lines.push(`- Files scanned: ${scanned}`);
  lines.push(`- Candidates flagged: ${candidates.length}`);
  if (mode === "apply") {
    lines.push(`- Files deleted: ${deleted.length}`);
  }

  if (errors.length) {
    lines.push("");
    lines.push("## Errors");
    errors.forEach(err => {
      lines.push(`- ${err.path}: ${err.message}`);
    });
  }

  lines.push("");
  lines.push("## Candidates");
  lines.push("");
  if (!candidates.length) {
    lines.push("_None_");
  } else {
    lines.push("| File | Reasons |");
    lines.push("| --- | --- |");
    candidates.forEach(entry => {
      const reasons = entry.reasons.map(reason => REASON_LABELS[reason] || reason).join(", ");
      lines.push(`| ${entry.path} | ${reasons} |`);
    });
  }

  return `${lines.join("\n")}\n`;
}

async function backupFile(app, entry, options) {
  if (!options.backups) return null;
  if (!options.backupDir) {
    console.warn("[delete_empty_inbox] Backups requested but no backup directory could be resolved; skipping backups.");
    return null;
  }

  const relativePath = entry.path;
  const backupPath = path.join(options.backupDir, options.runStamp, ...relativePath.split("/"));
  await ensureDir(path.dirname(backupPath));
  const contents = await app.vault.read(entry.file);
  await fsp.writeFile(backupPath, contents, "utf8");
  return backupPath;
}

async function deleteEntries(app, entries, options, errors) {
  const deleted = [];
  for (const entry of entries) {
    try {
      await backupFile(app, entry, options);
      await app.vault.delete(entry.file);
      deleted.push(entry.path);
    } catch (error) {
      errors.push({ path: entry.path, message: error.message });
    }
  }
  return deleted;
}

function summaryMessage(options, candidates, deleted) {
  const { mode, includes } = options;
  const targetSummary = includes.length === 1 ? `"${includes[0]}"` : `${includes.length} folders`;

  if (candidates.length === 0) {
    return `🧹 Inbox clean — nothing to delete in ${targetSummary}.`;
  }

  if (mode === "dry-run") {
    return `🔍 Dry run: ${candidates.length} empty file(s) identified in ${targetSummary}.`;
  }

  return `🗑️ Deleted ${deleted.length}/${candidates.length} file(s) from ${targetSummary}.`;
}

async function runDeleteEmptyInbox(rawParams = {}, context = {}) {
  const app = resolveApp(context.app);
  const Notice = resolveNotice(context.Notice);
  const options = buildOptions(rawParams, context, app);

  if (options.mode === "apply") {
    if (options.approvalToken !== "APPROVED") {
      throw new Error("delete_empty_inbox apply mode requires approvalToken='APPROVED'.");
    }
    if (!options.backups) {
      throw new Error("delete_empty_inbox apply mode requires backups=true.");
    }
  }

  const allMarkdownFiles = app.vault.getMarkdownFiles ? app.vault.getMarkdownFiles() : [];
  const scannedFiles = allMarkdownFiles.filter(file => {
    const relPath = normalisePath(file.path);
    return matchesFolders(relPath, options.includes, options.excludes);
  });

  const candidates = [];
  const errors = [];

  for (const file of scannedFiles) {
    try {
      const result = await evaluateFile(app, file);
      if (result) {
        candidates.push(result);
      }
    } catch (error) {
      errors.push({ path: normalisePath(file.path), message: error.message });
    }
  }

  let deleted = [];
  if (options.mode === "apply" && candidates.length > 0) {
    deleted = await deleteEntries(app, candidates, options, errors);
  }

  const message = summaryMessage(options, candidates, deleted);
  if (options.emitNotice) {
    try {
      new Notice(message, 8000);
    } catch (error) {
      console.log(`[Notice] ${message}`);
    }
  }
  console.log(`[delete_empty_inbox] ${message}`);

  const logPathAbs = await writeLog(options, {
    candidates: candidates.map(entry => ({ path: entry.path, reasons: entry.reasons })),
    deleted,
    scanned: scannedFiles.length,
    errors
  });

  return {
    mode: options.mode,
    includes: options.includes,
    excludes: options.excludes,
    backups: options.backups,
    scanned: scannedFiles.length,
    candidates: candidates.map(entry => ({ path: entry.path, reasons: entry.reasons })),
    deleted,
    logPath: options.logPath,
    logPathAbs,
    errors
  };
}

module.exports = runDeleteEmptyInbox;

async function runCli() {
  const args = process.argv.slice(2);
  const rawInput = args.length ? args.join(" ") : "{}";
  let parsed;
  try {
    parsed = JSON.parse(rawInput);
  } catch (error) {
    console.error("delete_empty_inbox CLI expects a JSON argument. Example:");
    console.error('  node delete_empty_inbox.js "{\"mode\":\"dry-run\"}"');
    process.exit(1);
  }

  try {
    const result = await runDeleteEmptyInbox(parsed, {});
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("delete_empty_inbox failed:", error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  runCli();
}
