#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

// Adjust this list to reflect the fields that must exist in every note's frontmatter.
const REQUIRED_KEYS = ["title", "type", "status", "created"];
const IGNORED_DIRECTORIES = new Set([".git", "node_modules", ".obsidian", ".github"]);

const notify = (message) => {
  if (typeof Notice === "function") {
    // Obsidian's Notice API (duration defaults to 4s; extend for readability)
    new Notice(message, 8000);
  } else {
    console.log(message);
  }
};

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const extractFrontmatter = (content) => {
  const match = content.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/);
  return match ? match[1] : null;
};

const collectMarkdownFiles = async (dir) => {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name.startsWith(".")) {
      if (entry.isDirectory()) {
        if (IGNORED_DIRECTORIES.has(entry.name)) continue;
      }
    }

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (IGNORED_DIRECTORIES.has(entry.name)) continue;
      const nested = await collectMarkdownFiles(fullPath);
      files.push(...nested);
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
      files.push(fullPath);
    }
  }

  return files;
};

const analyzeFrontmatter = async (filePath) => {
  try {
    const raw = await fs.promises.readFile(filePath, "utf8");
    const frontmatter = extractFrontmatter(raw);

    if (!frontmatter) {
      return { filePath, missing: REQUIRED_KEYS.slice(), hasFrontmatter: false };
    }

    const missing = REQUIRED_KEYS.filter((key) => {
      // Match: start of line, optional spaces, the key, then colon
      const pattern = new RegExp(`^\\s*${escapeRegex(key)}\\s*:`, "m");
      return !pattern.test(frontmatter);
    });

    return { filePath, missing, hasFrontmatter: true };
  } catch (error) {
    return { filePath, missing: REQUIRED_KEYS.slice(), hasFrontmatter: false, error };
  }
};

(async () => {
  const providedPath = process.argv[2];
  const targetDirectory = providedPath
    ? path.resolve(process.cwd(), providedPath)
    : path.resolve(__dirname, "..", "..");

  try {
    const stats = await fs.promises.stat(targetDirectory);
    if (!stats.isDirectory()) {
      throw new Error(`Target path is not a directory: ${targetDirectory}`);
    }
  } catch (err) {
    const message = `[Frontmatter Check] Unable to access directory: ${targetDirectory}\n${err.message}`;
    notify(message);
    process.exitCode = 1;
    return;
  }

  const markdownFiles = await collectMarkdownFiles(targetDirectory);

  if (!markdownFiles.length) {
    notify(`[Frontmatter Check] No Markdown files found under ${targetDirectory}`);
    return;
  }

  const results = [];
  for (const file of markdownFiles) {
    // eslint-disable-next-line no-await-in-loop
    const result = await analyzeFrontmatter(file);
    if (result.missing.length || result.error) {
      results.push(result);
    }
  }

  if (!results.length) {
    notify(`[Frontmatter Check] All ${markdownFiles.length} Markdown files contain required keys: ${REQUIRED_KEYS.join(", ")}`);
    return;
  }

  const summaryMessage = `[Frontmatter Check] ${results.length} of ${markdownFiles.length} file(s) are missing required keys (${REQUIRED_KEYS.join(", ")}).`;
  notify(summaryMessage);

  for (const issue of results) {
    const relative = path.relative(targetDirectory, issue.filePath) || path.basename(issue.filePath);
    if (issue.error) {
      console.error(`- ${relative}: error reading file (${issue.error.message})`);
      continue;
    }
    if (!issue.hasFrontmatter) {
      console.error(`- ${relative}: missing frontmatter block`);
    } else {
      console.error(`- ${relative}: missing keys -> ${issue.missing.join(", ")}`);
    }
  }

  process.exitCode = 1;
})();
