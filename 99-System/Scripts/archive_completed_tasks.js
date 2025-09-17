const DEFAULT_ARCHIVE_PATH = "task_archive.md";
const CHECKED_TASK_REGEX = /^(\s*[-*]\s+\[[xX]\]\s*)(.*)$/;

const normalizePath = (inputPath) => inputPath.replace(/\\/g, "/");

const isFenceLine = (line) => {
  const trimmed = line.trim();
  if (!trimmed.startsWith("```") && !trimmed.startsWith("~~~")) {
    return null;
  }
  const fenceMatch = trimmed.match(/^(```+|~~~+)/);
  return fenceMatch ? fenceMatch[1] : null;
};

const getLinkText = (app, file, sourcePath) => {
  try {
    if (app?.metadataCache?.fileToLinktext) {
      return app.metadataCache.fileToLinktext(file, sourcePath, true);
    }
  } catch (error) {
    console.warn("Failed to build Obsidian link, falling back to raw path", error);
  }

  return normalizePath(file.path).replace(/\.md$/i, "");
};

const ensureArchiveFile = async (app, archivePath) => {
  const normalizedArchivePath = normalizePath(archivePath);

  const existing = typeof app.vault.getAbstractFileByPath === "function"
    ? app.vault.getAbstractFileByPath(normalizedArchivePath)
    : null;
  if (existing) {
    return existing;
  }

  const markdownFiles = app.vault.getMarkdownFiles();
  const found = markdownFiles.find((file) => normalizePath(file.path) === normalizedArchivePath);
  if (found) {
    return found;
  }

  const initialContent = "# Task Archive\n\n";
  try {
    const created = await app.vault.create(normalizedArchivePath, initialContent);
    return created;
  } catch (error) {
    console.warn(`archive_completed_tasks: unable to create ${normalizedArchivePath}`, error);
  }

  const fallback = typeof app.vault.getAbstractFileByPath === "function"
    ? app.vault.getAbstractFileByPath(normalizedArchivePath)
    : null;
  if (fallback) {
    return fallback;
  }

  return app.vault.getMarkdownFiles().find((file) => normalizePath(file.path) === normalizedArchivePath) || null;
};

const collectTaskBlock = (lines, startIndex, indentLength) => {
  const blockLines = [];
  let index = startIndex + 1;

  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) {
      blockLines.push(index);
      index += 1;
      continue;
    }

    const trimmed = line.trimStart();
    const nextIndent = line.length - trimmed.length;

    if (nextIndent <= indentLength) {
      break;
    }

    if (/^[-*+]\s/.test(trimmed)) {
      break;
    }

    blockLines.push(index);
    index += 1;
  }

  return blockLines;
};

const archiveCompletedTasks = async (context = {}) => {
  const obsidianApp = context.app || (typeof window !== "undefined" ? window.app : null);
  if (!obsidianApp) {
    throw new Error("archive_completed_tasks: Obsidian app instance not found.");
  }

  const app = obsidianApp;
  const archivePath = context.archivePath ? normalizePath(context.archivePath) : DEFAULT_ARCHIVE_PATH;
  const skipPaths = new Set((context.skipPaths || []).map(normalizePath));
  skipPaths.add(normalizePath(archivePath));

  const markdownFiles = app.vault.getMarkdownFiles();
  const tasks = [];
  const modifiedFiles = [];

  for (const file of markdownFiles) {
    const filePath = normalizePath(file.path);
    if (skipPaths.has(filePath)) {
      continue;
    }

    const originalContent = await app.vault.read(file);
    const newline = originalContent.includes("\r\n") ? "\r\n" : "\n";
    const lines = originalContent.split(/\r?\n/);

    const remaining = [];
    let changed = false;
    let inFence = false;
    let activeFence = null;

    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i];
      const trimmed = line.trim();

      const fence = isFenceLine(line);
      if (fence) {
        if (!inFence) {
          inFence = true;
          activeFence = fence.startsWith("```") ? "```" : "~~~";
        } else if (trimmed.startsWith(activeFence || fence)) {
          inFence = false;
          activeFence = null;
        }
        remaining.push(line);
        continue;
      }

      if (inFence) {
        remaining.push(line);
        continue;
      }

      if (!trimmed) {
        remaining.push(line);
        continue;
      }

      if (trimmed.startsWith(">")) {
        remaining.push(line);
        continue;
      }

      const match = line.match(CHECKED_TASK_REGEX);
      if (!match) {
        remaining.push(line);
        continue;
      }

      changed = true;
      const taskText = match[2].trim();
      const indentLength = match[1].length - match[1].trimStart().length;
      const extraLines = collectTaskBlock(lines, i, indentLength);

      tasks.push({
        file,
        text: taskText,
      });

      if (extraLines.length) {
        i = extraLines[extraLines.length - 1];
      }
    }

    if (changed) {
      const newContent = remaining.join(newline);
      await app.vault.modify(file, newContent);
      modifiedFiles.push(file);
    }
  }

  if (!tasks.length) {
    if (!context.silent && typeof Notice !== "undefined") {
      new Notice("No completed tasks found.");
    }
    return { archived: 0, tasks: [], modified: [] };
  }

  const archiveFile = await ensureArchiveFile(app, archivePath);
  if (!archiveFile) {
    throw new Error(`archive_completed_tasks: unable to create or locate ${archivePath}`);
  }

  const archiveContent = await app.vault.read(archiveFile);
  const dateStamp = new Date().toISOString().slice(0, 10);
  const archiveLines = tasks.map((task) => {
    const linkText = getLinkText(app, task.file, archivePath);
    const text = task.text || "(no description)";
    return `- [x] ${text} — [[${linkText}]]`;
  });

  const needsSeparation = archiveContent.length > 0 && !archiveContent.endsWith("\n\n");
  const prefix = `${needsSeparation ? "\n\n" : ""}## ${dateStamp}\n`;
  const addition = `${prefix}${archiveLines.join("\n")}\n`;
  await app.vault.modify(archiveFile, archiveContent + addition);

  if (!context.silent && typeof Notice !== "undefined") {
    new Notice(`Archived ${tasks.length} completed task${tasks.length === 1 ? "" : "s"}.`);
  }

  return { archived: tasks.length, tasks, modified: modifiedFiles };
};

module.exports = archiveCompletedTasks;

if (typeof require !== "undefined" && require.main === module) {
  const path = require("path");
  const { promises: fs } = require("fs");

  const IGNORED_DIRECTORIES = new Set([".git", ".obsidian", "node_modules", ".github"]);

  const createFsApp = async (root, archivePath) => {
    const markdownFiles = [];

    const walk = async (dir) => {
      const directoryPath = path.join(root, dir);
      const entries = await fs.readdir(directoryPath, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory()) {
          if (IGNORED_DIRECTORIES.has(entry.name)) {
            continue;
          }
          const subdir = dir === "." ? entry.name : `${dir}/${entry.name}`;
          await walk(subdir);
        } else if (entry.isFile() && entry.name.endsWith(".md")) {
          const relative = dir === "." ? entry.name : `${dir}/${entry.name}`;
          markdownFiles.push({
            path: normalizePath(relative),
            basename: entry.name.replace(/\.md$/i, ""),
            extension: "md",
          });
        }
      }
    };

    await walk(".");

    const resolvePath = (relativePath) => path.join(root, relativePath);

    const ensureParentExists = async (filePath) => {
      const dir = path.dirname(filePath);
      await fs.mkdir(dir, { recursive: true });
    };

    const getFileByPath = (filePath) => markdownFiles.find((file) => normalizePath(file.path) === normalizePath(filePath)) || null;

    return {
      vault: {
        getMarkdownFiles: () => markdownFiles,
        async read(file) {
          return fs.readFile(resolvePath(file.path), "utf8");
        },
        async modify(file, data) {
          await ensureParentExists(resolvePath(file.path));
          await fs.writeFile(resolvePath(file.path), data, "utf8");
        },
        async create(filePath, data) {
          const resolved = resolvePath(filePath);
          await ensureParentExists(resolved);
          await fs.writeFile(resolved, data, "utf8");
          const created = {
            path: normalizePath(filePath),
            basename: path.basename(filePath, ".md"),
            extension: "md",
          };
          markdownFiles.push(created);
          return created;
        },
        getAbstractFileByPath(filePath) {
          return getFileByPath(filePath);
        },
      },
      metadataCache: {
        fileToLinktext(targetFile, sourcePath) {
          const sourceDir = path.dirname(sourcePath);
          const resolved = path.relative(sourceDir, targetFile.path).replace(/\\/g, "/");
          if (!resolved) {
            return path.basename(targetFile.path, ".md");
          }
          if (!resolved.endsWith(".md")) {
            return resolved;
          }
          return resolved.replace(/\.md$/i, "");
        },
      },
    };
  };

  (async () => {
    try {
      const root = process.cwd();
      const archivePath = DEFAULT_ARCHIVE_PATH;
      const app = await createFsApp(root, archivePath);
      await archiveCompletedTasks({ app, archivePath, silent: true });
      console.log("archive_completed_tasks: completed successfully.");
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  })();
}
