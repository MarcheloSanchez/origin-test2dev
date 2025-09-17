#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');

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
