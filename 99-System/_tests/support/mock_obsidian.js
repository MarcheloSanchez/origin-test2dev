const fs = require("fs");
const path = require("path");

const fsp = fs.promises;

function normalisePath(filepath) {
  return filepath.replace(/\\/g, "/");
}

function collectMarkdownFiles(root) {
  const absoluteRoot = path.resolve(root);
  const results = [];

  function walk(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
        const rel = normalisePath(path.relative(absoluteRoot, fullPath));
        results.push({
          path: rel,
          basename: path.basename(entry.name, path.extname(entry.name)),
          extension: path.extname(entry.name).slice(1)
        });
      }
    }
  }

  walk(absoluteRoot);
  results.sort((a, b) => a.path.localeCompare(b.path));
  return results;
}

function createMockNotice(logger = console.log) {
  return class MockNotice {
    constructor(message) {
      logger(`[Notice] ${message}`);
    }
  };
}

function createMockApp(vaultRoot, logger = console.log) {
  if (!vaultRoot) throw new Error("vaultRoot is required for the mock app");
  const absoluteRoot = path.resolve(vaultRoot);

  const cache = { files: null };
  const refresh = () => {
    cache.files = collectMarkdownFiles(absoluteRoot);
    return cache.files;
  };

  const ensureCache = () => (cache.files ?? refresh());

  const vault = {
    getMarkdownFiles() {
      return ensureCache();
    },
    async read(file) {
      const relPath = typeof file === "string" ? file : file.path;
      const absolute = path.join(absoluteRoot, relPath);
      return fsp.readFile(absolute, "utf8");
    },
    async delete(file) {
      const relPath = typeof file === "string" ? file : file.path;
      const absolute = path.join(absoluteRoot, relPath);
      await fsp.unlink(absolute);
      refresh();
    },
    adapter: {
      basePath: absoluteRoot,
      async exists(relPath) {
        return fs.existsSync(path.join(absoluteRoot, relPath));
      },
      async mkdir(relPath) {
        await fsp.mkdir(path.join(absoluteRoot, relPath), { recursive: true });
      },
      async write(relPath, data) {
        await fsp.writeFile(path.join(absoluteRoot, relPath), data, "utf8");
      },
      async read(relPath) {
        return fsp.readFile(path.join(absoluteRoot, relPath), "utf8");
      }
    }
  };

  return {
    app: { vault },
    Notice: createMockNotice(logger)
  };
}

module.exports = {
  createMockApp,
  createMockNotice
};
