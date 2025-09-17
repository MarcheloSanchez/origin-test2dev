#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Find the nearest ancestor directory (including startDir) that appears to be the vault root.
 *
 * Walks upward from startDir until it finds a directory containing either a `.git` or `.obsidian` entry;
 * if none is found before reaching the filesystem root, returns the original startDir.
 *
 * @param {string} startDir - Path to start searching from.
 * @returns {string} The detected vault root directory, or startDir if no root marker is found.
 */
function findVaultRoot(startDir) {
  let current = startDir;
  while (true) {
    const hasGit = fs.existsSync(path.join(current, '.git'));
    const hasObsidian = fs.existsSync(path.join(current, '.obsidian'));
    if (hasGit || hasObsidian) {
      return current;
    }

    const parent = path.dirname(current);
    if (parent === current) {
      return startDir;
    }
    current = parent;
  }
}

/**
 * Determine the vault's attachment directory (absolute and POSIX-relative) using .obsidian/app.json if present.
 *
 * Reads rootDir/.obsidian/app.json and, when it contains a non-empty string property `attachmentFolderPath`, uses
 * that value as the attachment folder relative path. Falls back to '99-System/Images' if the config is missing or
 * the property is empty. Normalizes backslashes to forward slashes and strips trailing slashes, then resolves an
 * absolute path against `rootDir`.
 *
 * Note: If app.json exists but cannot be parsed, a warning is emitted and the default is used. This function does
 * not throw for parse errors.
 *
 * @param {string} rootDir - Filesystem path to the vault root used as the base for resolving the attachment folder.
 * @return {{ absolute: string, relative: string }} Object with `absolute` (resolved absolute path) and `relative`
 * path (POSIX-style path relative to `rootDir`).
 */
function loadAttachmentDirectory(rootDir) {
  const configPath = path.join(rootDir, '.obsidian', 'app.json');
  let attachmentRelative = '99-System/Images';

  if (fs.existsSync(configPath)) {
    try {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      if (config && typeof config.attachmentFolderPath === 'string') {
        const trimmed = config.attachmentFolderPath.trim();
        if (trimmed) {
          attachmentRelative = trimmed;
        }
      }
    } catch (error) {
      console.warn(`Warning: unable to parse ${configPath}: ${error.message}`);
    }
  }

  attachmentRelative = attachmentRelative.replace(/\\/g, '/');
  attachmentRelative = attachmentRelative.replace(/\/+$/, '');

  const absolute = path.resolve(rootDir, attachmentRelative);

  return {
    absolute,
    relative: attachmentRelative || '.',
  };
}

/**
 * Recursively scan a directory and index all files as attachments.
 *
 * Traverses `dir` depth-first, skipping dotfiles and `.`/`..`. For each file found it:
 * - computes its POSIX-style path relative to `rootDir` and adds an entry to `attachments`
 *   with value `false` (meaning "not yet referenced"),
 * - records the file under its basename in `baseNameMap` (basename -> array of relative paths).
 *
 * @param {string} dir - Directory to scan.
 * @param {string} rootDir - Vault root used to compute relative POSIX paths.
 * @param {Map<string, boolean>} attachments - Map that will be populated with relative path -> referenced flag.
 * @param {Map<string, string[]>} baseNameMap - Map that will be populated with basename -> list of relative paths.
 */
function collectAttachments(dir, rootDir, attachments, baseNameMap) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === '.' || entry.name === '..') {
      continue;
    }
    if (entry.name.startsWith('.')) {
      continue;
    }

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectAttachments(fullPath, rootDir, attachments, baseNameMap);
    } else if (entry.isFile()) {
      const relative = path.relative(rootDir, fullPath).split(path.sep).join('/');
      attachments.set(relative, false);

      const baseName = entry.name;
      if (!baseNameMap.has(baseName)) {
        baseNameMap.set(baseName, []);
      }
      baseNameMap.get(baseName).push(relative);
    }
  }
}

/**
 * Recursively traverses a directory tree and invokes a collector for each Markdown file found.
 *
 * Traversal is depth-first. Hidden directories (names starting with '.'), entries listed in
 * ignoreDirs, and the attachmentsDir (and its descendants) are skipped. For each file whose
 * name ends with '.md' (case-insensitive), the collector is called with the file's full path.
 *
 * @param {string} dir - The directory to traverse.
 * @param {string} rootDir - The repository/vault root used to compute relative paths for filtering.
 * @param {Set<string>} ignoreDirs - Directory names (not paths) to skip during traversal.
 * @param {string} attachmentsDir - Relative POSIX-style path of the attachments directory (from rootDir)
 *   which should not be descended into; may be empty or falsy to disable this filter.
 * @param {(filePath: string) => void} collector - Called for each discovered Markdown file with its full path.
 */
function walkMarkdownFiles(dir, rootDir, ignoreDirs, attachmentsDir, collector) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === '.' || entry.name === '..') {
      continue;
    }

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (entry.name.startsWith('.')) {
        continue;
      }

      if (ignoreDirs.has(entry.name)) {
        continue;
      }

      const relative = path.relative(rootDir, fullPath).split(path.sep).join('/');
      if (
        relative === attachmentsDir ||
        attachmentsDir && relative.startsWith(`${attachmentsDir}/`)
      ) {
        continue;
      }

      walkMarkdownFiles(fullPath, rootDir, ignoreDirs, attachmentsDir, collector);
      continue;
    }

    if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) {
      collector(fullPath);
    }
  }
}

/**
 * Mark all attachments that share the given base filename as referenced.
 *
 * Looks up `baseName` in `baseNameMap` and sets the corresponding entries in
 * `attachments` to `true` for every matching relative path.
 *
 * @param {string} baseName - Filename with extension (e.g., "image.png"); must include a dot.
 * @param {Map<string, boolean>} attachments - Map from attachment relative POSIX path to a boolean indicating whether it's referenced; entries found will be set to `true`.
 * @param {Map<string, string[]>} baseNameMap - Map from a basename to an array of relative POSIX paths that share that basename.
 * @return {boolean} True if one or more attachments were marked; false if no matches were found or `baseName` was invalid.
 */
function markBaseName(baseName, attachments, baseNameMap) {
  if (!baseName || !baseName.includes('.')) {
    return false;
  }
  const matches = baseNameMap.get(baseName);
  if (!matches || matches.length === 0) {
    return false;
  }
  for (const match of matches) {
    attachments.set(match, true);
  }
  return true;
}

/**
 * Mark an attachment as referenced by resolving a provided relative path against the known attachments.
 *
 * Normalizes the given path (converts backslashes to slashes, removes leading `./` or `/`, strips query
 * and fragment parts, and POSIX-normalizes), then checks for a matching key in the attachments map.
 * Also considers the same path prefixed with `attachmentsDir` (if provided) as an additional candidate.
 * When a match is found, the corresponding entry in `attachments` is set to `true`.
 *
 * @param {string} relPath - The raw relative path extracted from a link or embed.
 * @param {Map<string, boolean>} attachments - Map of attachment relative POSIX paths -> referenced flag; entries will be updated to `true` when matched.
 * @param {string} [attachmentsDir] - Relative POSIX path to the attachments directory (e.g. "99-System/Images"); used to form an additional candidate when the normalized path is not already within this directory.
 * @returns {boolean} True if one or more attachment entries were marked as referenced; otherwise false.
 */
function markRelativePath(relPath, attachments, attachmentsDir) {
  if (!relPath) {
    return false;
  }

  let normalized = relPath.replace(/\\/g, '/');
  normalized = normalized.replace(/^\.\/+/, '');
  normalized = normalized.replace(/^\/+/, '');
  normalized = normalized.split('?')[0];
  normalized = normalized.split('#')[0];
  if (!normalized) {
    return false;
  }

  normalized = path.posix.normalize(normalized);

  const candidates = new Set([normalized]);
  if (attachmentsDir && !normalized.startsWith(attachmentsDir)) {
    candidates.add(path.posix.join(attachmentsDir, normalized));
  }

  let marked = false;
  for (const candidate of candidates) {
    const cleaned = candidate.replace(/^\.\//, '');
    if (attachments.has(cleaned)) {
      attachments.set(cleaned, true);
      marked = true;
    }
  }

  return marked;
}

/**
 * Process a wikilink target and mark any referenced attachment(s) as used.
 *
 * Cleans the raw wikilink target by removing aliases (`|...`) and anchors/fragments (`#...`),
 * normalizes path separators to POSIX (`/`), and then attempts to mark a matching attachment:
 * first by the cleaned relative path, then (if that fails) by the file's base name.
 *
 * @param {string} rawTarget - The raw wikilink target text (e.g. `Notes/Image.png|caption` or `Folder/Image.png#section`).
 * @param {Map<string, boolean>} attachments - Map of attachment relative POSIX paths -> referenced flag; entries will be set to `true` when matched.
 * @param {Map<string, string[]>} baseNameMap - Map from a file base name to an array of matching relative paths; used for basename fallback matches.
 * @param {string} attachmentsDir - The attachments directory relative path (POSIX-style) used when resolving relative-path candidates.
 */
function handleWikilink(rawTarget, attachments, baseNameMap, attachmentsDir) {
  if (!rawTarget) {
    return;
  }
  const cleaned = rawTarget.split('|')[0].split('#')[0].trim();
  if (!cleaned) {
    return;
  }

  const normalized = cleaned.replace(/\\/g, '/');
  if (!markRelativePath(normalized, attachments, attachmentsDir)) {
    const baseName = path.posix.basename(normalized);
    markBaseName(baseName, attachments, baseNameMap);
  }
}

/**
 * Process a Markdown link target and mark any matching attachment(s) as referenced.
 *
 * Cleans and normalizes the link target (removes angle brackets, trailing anchors/queries, and quotes),
 * ignores external URLs (schemes like `http:`), and attempts to mark matching attachments by:
 * 1. Interpreting the target as a direct relative path (normalized to POSIX slashes).
 * 2. Resolving the target relative to the source Markdown file and marking that path if it lies within the vault root.
 * 3. Falling back to matching by the target's basename against the base-name index.
 *
 * @param {string} rawTarget - The raw target string extracted from a Markdown link/image (e.g., the `(url)` part).
 * @param {string} sourcePath - Absolute path to the Markdown file that contains the link; used to resolve relative targets.
 * @param {string} rootDir - Absolute vault root directory; used to determine resolved-relative attachment paths.
 * @param {Map<string,boolean>} attachments - Map of attachment relative POSIX paths -> referenced flag; entries are marked true when found.
 * @param {Map<string,string[]>} baseNameMap - Map from filename base (e.g., `image.png`) to arrays of attachment relative paths for basename lookups.
 * @param {string} attachmentsDir - Relative POSIX path to the attachments directory (used as an additional candidate prefix).
 */
function handleMarkdownLink(rawTarget, sourcePath, rootDir, attachments, baseNameMap, attachmentsDir) {
  if (!rawTarget) {
    return;
  }

  let cleaned = rawTarget.trim();
  if (!cleaned) {
    return;
  }

  if (cleaned.startsWith('<') && cleaned.endsWith('>')) {
    cleaned = cleaned.slice(1, -1).trim();
  }

  const quoteIndex = cleaned.indexOf('"');
  if (quoteIndex !== -1) {
    cleaned = cleaned.slice(0, quoteIndex).trim();
  }

  const singleQuoteIndex = cleaned.indexOf("'");
  if (singleQuoteIndex !== -1) {
    cleaned = cleaned.slice(0, singleQuoteIndex).trim();
  }

  cleaned = cleaned.split('#')[0].split('?')[0].trim();

  if (!cleaned) {
    return;
  }

  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(cleaned)) {
    return;
  }

  const normalizedDirect = cleaned.replace(/\\/g, '/');
  markRelativePath(normalizedDirect, attachments, attachmentsDir);

  const resolvedAbsolute = path.resolve(path.dirname(sourcePath), cleaned);
  if (resolvedAbsolute.startsWith(rootDir)) {
    const resolvedRelative = path.relative(rootDir, resolvedAbsolute).split(path.sep).join('/');
    markRelativePath(resolvedRelative, attachments, attachmentsDir);
  }

  const baseName = path.posix.basename(normalizedDirect);
  markBaseName(baseName, attachments, baseNameMap);
}

/**
 * Scan the vault for attachments, mark those referenced from Markdown files, and report orphaned attachments.
 *
 * Traverses the vault to locate the attachment folder, builds an index of all files in that folder (and a basename index),
 * scans Markdown files for wikilinks, embedded links, and Markdown image links to mark referenced attachments, then prints
 * a summary with total, referenced, and orphaned attachment counts and a sorted list of orphaned paths.
 *
 * Side effects:
 * - Writes status and results to the console.
 * - Sets process.exitCode = 1 and returns early if the attachment directory does not exist or is not a directory.
 *
 * Notes:
 * - Files that cannot be read while scanning Markdown files emit a warning but do not stop the scan.
 */
function main() {
  const scriptDir = __dirname;
  const rootDir = findVaultRoot(scriptDir);

  const { absolute: attachmentsPath, relative: attachmentRelative } = loadAttachmentDirectory(rootDir);
  const attachmentsDirNormalized = attachmentRelative.replace(/\\/g, '/').replace(/^\.\/+/, '').replace(/^\/+/, '');

  if (!fs.existsSync(attachmentsPath) || !fs.statSync(attachmentsPath).isDirectory()) {
    console.error(`Attachment directory not found: ${attachmentsPath}`);
    process.exitCode = 1;
    return;
  }

  const attachments = new Map();
  const baseNameMap = new Map();
  collectAttachments(attachmentsPath, rootDir, attachments, baseNameMap);

  if (attachments.size === 0) {
    console.log(`No files found in attachment directory (${attachmentsPath}).`);
    return;
  }

  const markdownFiles = [];
  const ignoreNames = new Set(['.git', '.github', '.obsidian', 'node_modules', '.trash', '.idea']);
  walkMarkdownFiles(rootDir, rootDir, ignoreNames, attachmentsDirNormalized, (filePath) => {
    markdownFiles.push(filePath);
  });

  const embedRegex = /!\[\[([^\]]+)\]\]/g;
  const wikilinkRegex = /\[\[([^\]]+)\]\]/g;
  const markdownImageRegex = /!\[[^\]]*\]\(([^)]+)\)/g;

  for (const mdPath of markdownFiles) {
    let content;
    try {
      content = fs.readFileSync(mdPath, 'utf8');
    } catch (error) {
      console.warn(`Warning: unable to read ${mdPath}: ${error.message}`);
      continue;
    }

    let match;
    while ((match = embedRegex.exec(content)) !== null) {
      handleWikilink(match[1], attachments, baseNameMap, attachmentsDirNormalized);
    }

    while ((match = wikilinkRegex.exec(content)) !== null) {
      if (match.index > 0 && content[match.index - 1] === '!') {
        continue;
      }
      handleWikilink(match[1], attachments, baseNameMap, attachmentsDirNormalized);
    }

    while ((match = markdownImageRegex.exec(content)) !== null) {
      handleMarkdownLink(
        match[1],
        mdPath,
        rootDir,
        attachments,
        baseNameMap,
        attachmentsDirNormalized
      );
    }
  }

  const allAttachments = Array.from(attachments.entries());
  const referencedCount = allAttachments.filter(([, used]) => used).length;
  const orphaned = allAttachments
    .filter(([, used]) => !used)
    .map(([file]) => file)
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

  console.log(`Attachment directory: ${attachmentsPath}`);
  console.log(`Total attachments: ${attachments.size}`);
  console.log(`Referenced attachments: ${referencedCount}`);
  console.log(`Orphaned attachments: ${orphaned.length}`);

  if (orphaned.length === 0) {
    console.log('No orphaned attachments found.');
  } else {
    console.log('Orphaned files:');
    for (const file of orphaned) {
      console.log(` - ${file}`);
    }
  }
}

main();
