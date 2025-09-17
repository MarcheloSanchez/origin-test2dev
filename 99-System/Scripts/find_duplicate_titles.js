#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..", "..");
const fsp = fs.promises;

const IGNORE_DIRECTORIES = new Set([
  ".git",
  "node_modules",
  ".obsidian",
  ".trash",
  ".Trash",
  ".DS_Store"
]);

const hasWindow = typeof window !== "undefined" && window !== null;
const inObsidian = hasWindow && typeof window.app?.vault?.getMarkdownFiles === "function";

function notify(message) {
  if (hasWindow && typeof window.Notice === "function") {
    new window.Notice(message, 8000);
  }
}

function normalisePath(filepath) {
  return filepath.replace(/\\/g, "/");
}

async function collectFromFilesystem() {
  const files = [];

  async function walk(currentDir) {
    let entries;
    try {
      entries = await fsp.readdir(currentDir, { withFileTypes: true });
    } catch (error) {
      console.warn(`Unable to read directory ${currentDir}: ${error.message}`);
      return;
    }

    for (const entry of entries) {
      if (entry.name.startsWith(".")) {
        if (IGNORE_DIRECTORIES.has(entry.name)) continue;
      }

      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        if (IGNORE_DIRECTORIES.has(entry.name)) continue;
        await walk(fullPath);
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
        const relPath = normalisePath(path.relative(rootDir, fullPath));
        files.push({
          path: relPath,
          async read() {
            return fsp.readFile(fullPath, "utf8");
          }
        });
      }
    }
  }

  await walk(rootDir);
  return files;
}

async function collectFromObsidian() {
  const { app } = window;
  const vaultFiles = app.vault.getMarkdownFiles();
  return vaultFiles.map(file => ({
    path: normalisePath(file.path),
    async read() {
      return app.vault.read(file);
    }
  }));
}

function extractTitle(content) {
  if (!content) return null;
  const normalised = content.replace(/\r\n/g, "\n").replace(/^﻿/, "");
  const match = normalised.match(/^\s*---\n([\s\S]*?)\n---(?:\s*\n|\s*$)/);
  if (!match) return null;

  const frontMatter = match[1];
  const lines = frontMatter.split("\n");

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const colonIndex = line.indexOf(":");
    if (colonIndex === -1) continue;

    const key = line.slice(0, colonIndex).trim();
    if (key.toLowerCase() !== "title") continue;

    let value = line.slice(colonIndex + 1).trim();
    if (!value) return null;

    // Remove wrapping quotes if present
    if ((value.startsWith("\"") && value.endsWith("\"")) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    return value.trim() || null;
  }

  return null;
}

async function getMarkdownSources() {
  if (inObsidian) {
    return collectFromObsidian();
  }
  return collectFromFilesystem();
}

function sortPaths(paths) {
  return [...paths].sort((a, b) => a.localeCompare(b));
}

async function run() {
  const sources = await getMarkdownSources();
  const titleMap = new Map();
  const errors = [];

  for (const source of sources) {
    let content;
    try {
      content = await source.read();
    } catch (error) {
      errors.push({ path: source.path, message: error.message });
      continue;
    }

    const title = extractTitle(content);
    if (!title) continue;

    const existing = titleMap.get(title) || [];
    existing.push(source.path);
    titleMap.set(title, existing);
  }

  const duplicates = [...titleMap.entries()]
    .map(([title, paths]) => [title, sortPaths(paths)])
    .filter(([, paths]) => paths.length > 1)
    .sort((a, b) => a[0].localeCompare(b[0]));

  if (duplicates.length === 0) {
    const message = "✅ No duplicate titles found.";
    console.log(message);
    notify(message);
    if (errors.length > 0) {
      console.warn("Encountered errors while scanning:");
      for (const { path: errPath, message: errMessage } of errors) {
        console.warn(`- ${errPath}: ${errMessage}`);
      }
    }
    return [];
  }

  console.log(`⚠️ Found ${duplicates.length} duplicate title(s):`);
  duplicates.forEach(([title, paths]) => {
    console.log(`- ${title}`);
    paths.forEach(p => console.log(`   • ${p}`));
  });

  if (errors.length > 0) {
    console.warn("Encountered errors while scanning:");
    for (const { path: errPath, message: errMessage } of errors) {
      console.warn(`- ${errPath}: ${errMessage}`);
    }
  }

  const summary = `⚠️ Found ${duplicates.length} title(s) with duplicates. See console for details.`;
  notify(summary);

  return duplicates;
}

module.exports = run;

if (require.main === module) {
  run().catch(error => {
    console.error("Error while searching for duplicate titles:", error);
    process.exitCode = 1;
  });
}
