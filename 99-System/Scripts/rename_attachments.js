/*
 * rename_attachments.js
 *
 * Batch-rename embedded attachments so that every file referenced by a note
 * follows the pattern `<slugified-note-title>-<index>.<ext>`.
 *
 * Behaviour:
 *   • Walks over markdown files (entire vault by default, or a specific
 *     note/folder when provided via args).
 *   • Reads each note's metadata cache (`cache.embeds`) to find attachment
 *     embeds (non-markdown targets).
 *   • Assigns deterministic names based on the note title and the order of the
 *     embeds, then renames the underlying files and ensures the note references
 *     pick up the change.
 *
 * Optional args (JSON via QuickAdd / Templater):
 *   { path?: "Note Path", folder?: "Folder/Path", active?: true,
 *     dryRun?: true, verifyDelay?: 120 }
 */
module.exports = async (rawArgs) => {
  const { app, Notice } = window;

  let args = rawArgs ?? {};
  if (typeof args === "string") {
    try { args = JSON.parse(args); }
    catch { args = {}; }
  }

  const dryRun = !!args.dryRun;
  const folderArg = typeof args.folder === "string" ? args.folder.trim() : null;
  const pathArg = typeof args.path === "string" ? args.path.trim() : null;
  const onlyActive = args.active === true;
  const verifyDelay = Number.isFinite(args.verifyDelay) ? Math.max(0, Number(args.verifyDelay)) : 120;

  const waitFor = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const normalizePath = (input) => {
    if (!input) return "";
    const trimmed = input.trim();
    if (!trimmed) return "";
    return trimmed
      .replace(/\\+/g, "/")
      .replace(/\/+/g, "/")
      .replace(/^\/+/, "")
      .replace(/\/+$/, "");
  };

  const escapeRegExp = (value) => {
    if (!value) return "";
    const specials = new Set(["\\", "^", "$", "*", "+", "?", ".", "(", ")", "|", "{", "}", "[", "]", "-", "/"]);
    let output = "";
    for (const char of value) {
      output += specials.has(char) ? `\\${char}` : char;
    }
    return output;
  };

  const slugify = (input) => {
    if (!input) return "";
    return input
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const ensureSlug = (basename) => {
    let slug = slugify(basename);
    if (slug) return slug;
    slug = (basename || "")
      .replace(/[^A-Za-z0-9]+/g, "")
      .toLowerCase();
    if (slug) return slug;
    return "note";
  };

  const resolveMarkdownFile = (value) => {
    if (!value) return null;
    const base = app.workspace.getActiveFile()?.path || "";
    const direct = app.metadataCache.getFirstLinkpathDest(value, base);
    if (direct?.extension === "md") return direct;

    const withExt = value.toLowerCase().endsWith(".md") ? value : `${value}.md`;
    const normalized = normalizePath(withExt);
    const abs = app.vault.getAbstractFileByPath(normalized);
    if (abs?.extension === "md") return abs;

    if (withExt !== value) {
      const alt = app.vault.getAbstractFileByPath(normalizePath(value));
      if (alt?.extension === "md") return alt;
    }
    return null;
  };

  const collectMarkdownFiles = () => {
    if (pathArg) {
      const resolved = resolveMarkdownFile(pathArg);
      return resolved ? [resolved] : [];
    }
    if (onlyActive) {
      const active = app.workspace.getActiveFile();
      return active ? [active] : [];
    }

    const all = app.vault.getMarkdownFiles();
    if (!folderArg) return all;

    const normalizedFolder = normalizePath(folderArg);
    if (!normalizedFolder) return all;

    const withSlash = `${normalizedFolder}/`;
    return all.filter((file) => file.path === normalizedFolder || file.path.startsWith(withSlash));
  };

  const files = collectMarkdownFiles();
  if (!files.length) {
    new Notice("rename_attachments: no target notes found", 4000);
    console.info("[rename_attachments] No markdown files match the given filters.");
    return;
  }

  const stats = { notesVisited: 0, notesTouched: 0, renamed: 0, skipped: 0, dryRun };

  for (const note of files) {
    stats.notesVisited += 1;

    const cache = app.metadataCache.getFileCache(note);
    const embeds = cache?.embeds || [];
    if (!embeds.length) continue;

    const uniqueAttachments = [];
    const seenPaths = new Set();

    for (const embed of embeds) {
      const target = app.metadataCache.getFirstLinkpathDest(embed.link, note.path);
      if (!target) continue;
      if (target.extension === "md") continue; // skip note embeds
      if (seenPaths.has(target.path)) continue;
      seenPaths.add(target.path);
      uniqueAttachments.push({ file: target });
    }

    if (!uniqueAttachments.length) continue;

    const slug = ensureSlug(note.basename);
    if (!slug) {
      console.warn(`[rename_attachments] Skipping ${note.path}: could not derive slug.`);
      continue;
    }

    const digits = Math.max(2, String(uniqueAttachments.length).length);
    let counter = 1;
    const usedDestinations = new Set();
    const plan = [];

    for (const entry of uniqueAttachments) {
      const attachment = entry.file;
      const folderPath = attachment.parent?.path || "";
      const prefix = folderPath ? `${folderPath}/` : "";
      const ext = attachment.extension ? `.${attachment.extension}` : "";
      const oldPath = attachment.path;
      const oldName = attachment.name || oldPath.split("/").pop() || oldPath;

      let newPath = attachment.path;
      let newName = attachment.name || attachment.path.split("/").pop();
      let changed = false;

      while (true) {
        const candidateBase = `${slug}-${String(counter).padStart(digits, "0")}`;
        counter += 1;
        const candidateName = `${candidateBase}${ext}`;
        const candidatePath = `${prefix}${candidateName}`;

        const existing = app.vault.getAbstractFileByPath(candidatePath);
        const conflict = existing && existing !== attachment;
        const alreadyPlanned = usedDestinations.has(candidatePath);

        if (conflict || alreadyPlanned) {
          continue;
        }

        newPath = candidatePath;
        newName = candidateName;
        changed = attachment.path !== newPath;
        usedDestinations.add(candidatePath);
        break;
      }

      plan.push({ attachment, newPath, newName, changed, oldPath, oldName });
    }

    const changedEntries = plan.filter(p => p.changed);
    if (!changedEntries.length) {
      stats.skipped += 1;
      continue;
    }

    stats.notesTouched += 1;

    if (dryRun) {
      stats.renamed += changedEntries.length;
      for (const step of changedEntries) {
        console.info(`[rename_attachments][dry-run] ${step.attachment.path} -> ${step.newPath}`);
      }
      continue;
    }

    const successfulRenames = [];
    for (const step of changedEntries) {
      const oldPath = step.oldPath;
      try {
        await app.fileManager.renameFile(step.attachment, step.newPath);
        const exists = await app.vault.adapter.exists(step.newPath);
        if (!exists) {
          console.warn(`[rename_attachments] Post-rename check failed for ${step.newPath}`);
        } else {
          console.log(`[rename_attachments] ${oldPath} -> ${step.newPath}`);
          stats.renamed += 1;
          successfulRenames.push({ ...step });
        }
      } catch (err) {
        console.error(`[rename_attachments] Failed to rename ${oldPath}:`, err);
      }
    }

    if (!successfulRenames.length) {
      continue;
    }

    const applyReferenceUpdates = (input, rename) => {
      let output = input;
      let touched = false;
      const dedupeTargets = new Set();

      const buildReplacementEntries = (oldTarget, newTarget) => {
        if (!oldTarget || !newTarget || oldTarget === newTarget) return [];
        const key = `${oldTarget}→${newTarget}`;
        if (dedupeTargets.has(key)) return [];
        dedupeTargets.add(key);
        const escaped = escapeRegExp(oldTarget);
        return [
          {
            pattern: new RegExp(`(!?\\[\\[[^\\]]*?)${escaped}(?=([^\\]]*)\\]\])`, "g"),
            replacement: `$1${newTarget}`,
          },
          {
            pattern: new RegExp(`(!?\\[[^\\]]*\\]\()${escaped}(?=\))`, "g"),
            replacement: `$1${newTarget}`,
          },
          {
            pattern: new RegExp(`(<img\\s+[^>]*src=["'])${escaped}(?=["'])`, "gi"),
            replacement: `$1${newTarget}`,
          },
        ];
      };

      const replacements = [
        ...buildReplacementEntries(rename.oldPath, rename.newPath),
        ...buildReplacementEntries(rename.oldName, rename.newName),
      ];

      for (const entry of replacements) {
        const next = output.replace(entry.pattern, entry.replacement);
        if (next !== output) {
          output = next;
          touched = true;
        }
      }

      return { output, touched };
    };

    await waitFor(verifyDelay);
    try {
      const originalContent = await app.vault.read(note);
      let updatedContent = originalContent;
      let contentChanged = false;

      for (const rename of successfulRenames) {
        const { output, touched } = applyReferenceUpdates(updatedContent, rename);
        if (touched) {
          updatedContent = output;
          contentChanged = true;
        }
      }

      if (contentChanged && updatedContent !== originalContent) {
        await app.vault.modify(note, updatedContent);
        console.info(`[rename_attachments] ${note.path}: refreshed attachment references.`);
        await waitFor(verifyDelay);
      }

      const finalContent = contentChanged ? updatedContent : originalContent;
      const missing = successfulRenames.filter(p => !finalContent.includes(p.newName));
      if (missing.length) {
        console.warn(`[rename_attachments] ${note.path}: unable to verify references for ${missing.map(m => m.newName).join(", ")}`);
      }
    } catch (err) {
      console.warn(`[rename_attachments] Could not verify note ${note.path}:`, err);
    }
  }

  const summary = dryRun
    ? `rename_attachments (dry-run): ${stats.notesTouched} notes would change, ${stats.renamed} files`
    : `rename_attachments: ${stats.renamed} attachments renamed across ${stats.notesTouched} notes`;

  new Notice(summary, 5000);
  console.info("[rename_attachments] Summary", stats);
};
