/**
 * Normalize frontmatter tags across the vault.
 * - Converts tags to lowercase
 * - Sorts tags alphabetically and removes duplicates
 * - Preserves wiki-link wrappers like [[Tag]]
 */
module.exports = async () => {
  const { app } = window;
  if (!app?.vault || !app.metadataCache) {
    console.log("Obsidian app context unavailable.");
    return;
  }

  const markdownFiles = app.vault.getMarkdownFiles();
  let updatedCount = 0;

  const arraysEqual = (a, b) => a.length === b.length && a.every((value, index) => value === b[index]);

  const splitTopLevel = (input) => {
    const parts = [];
    let current = "";
    let depth = 0;
    let quote = null;

    for (let i = 0; i < input.length; i += 1) {
      const char = input[i];

      if (quote) {
        current += char;
        if (char === quote && input[i - 1] !== "\\") {
          quote = null;
        }
        continue;
      }

      if (char === "\"" || char === "'") {
        quote = char;
        current += char;
        continue;
      }

      if (char === "[") {
        depth += 1;
        current += char;
        continue;
      }

      if (char === "]") {
        depth = Math.max(depth - 1, 0);
        current += char;
        continue;
      }

      if (char === "," && depth === 0) {
        if (current.trim()) {
          parts.push(current.trim());
        }
        current = "";
        continue;
      }

      current += char;
    }

    if (current.trim()) {
      parts.push(current.trim());
    }

    if (!parts.length && input.trim()) {
      return [input.trim()];
    }

    return parts;
  };

  const isWrappedInSingleBrackets = (text) => {
    if (!text.startsWith("[") || !text.endsWith("]")) {
      return false;
    }

    let depth = 0;
    for (let i = 0; i < text.length; i += 1) {
      const char = text[i];
      if (char === "[") {
        depth += 1;
      } else if (char === "]") {
        depth -= 1;
        if (depth === 0 && i < text.length - 1) {
          return false;
        }
      }
    }

    return depth === 0;
  };

  const collectTagEntries = (value, depth = 0, entries = []) => {
    if (value === null || value === undefined) {
      return entries;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => collectTagEntries(item, depth + 1, entries));
      return entries;
    }

    let str = typeof value === "string" ? value : String(value);
    str = str.trim();
    if (!str) {
      return entries;
    }

    if ((str.startsWith("\"") && str.endsWith("\"")) || (str.startsWith("'") && str.endsWith("'"))) {
      str = str.slice(1, -1).trim();
      if (!str) {
        return entries;
      }
    }

    const commaParts = splitTopLevel(str);
    if (commaParts.length > 1) {
      commaParts.forEach((part) => collectTagEntries(part, depth + 1, entries));
      return entries;
    }

    if (isWrappedInSingleBrackets(str) && !(str.startsWith("[[") && str.endsWith("]]"))) {
      const inner = str.slice(1, -1).trim();
      if (inner) {
        const innerParts = splitTopLevel(inner);
        innerParts.forEach((part) => collectTagEntries(part, depth + 1, entries));
      }
      return entries;
    }

    let base = str;
    let wrapWiki = false;

    if (str.startsWith("[[") && str.endsWith("]]")) {
      wrapWiki = true;
      base = str.slice(2, -2).trim();
    } else if (depth > 1) {
      wrapWiki = true;
    }

    if (!base) {
      return entries;
    }

    entries.push({
      base,
      wrapWiki,
    });

    return entries;
  };

  const analyzeTags = (rawTags) => {
    const entries = collectTagEntries(rawTags);
    if (!entries.length) {
      return {
        normalizedOrdered: [],
        normalizedSortedUnique: [],
        needsLowercase: false,
        needsSortingOrDedup: false,
      };
    }

    // Normalize to pairs and keep wrapper intent
    const normalizedPairs = entries.map((entry) => ({
      base: entry.base.toLowerCase(),
      wrapWiki: entry.wrapWiki,
    }));

    // Build ordered (original order) representation for change detection
    const normalizedOrdered = normalizedPairs.map(({ base, wrapWiki }) =>
      wrapWiki ? `[[${base}]]` : base
    );

    // Dedup by base; if any variant is wiki-linked, keep wiki-linked
    const byBase = new Map(); // base -> { wrapWiki: boolean }
    for (const { base, wrapWiki } of normalizedPairs) {
      const prev = byBase.get(base);
      byBase.set(base, { wrapWiki: Boolean(prev?.wrapWiki || wrapWiki) });
    }
    const normalizedSortedUnique = Array.from(byBase.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([base, { wrapWiki }]) => (wrapWiki ? `[[${base}]]` : base));

    const needsLowercase = entries.some((entry) => entry.base !== entry.base.toLowerCase());
    const needsSortingOrDedup = !arraysEqual(normalizedOrdered, normalizedSortedUnique);

    return {
      normalizedOrdered,
      normalizedSortedUnique,
      needsLowercase,
      needsSortingOrDedup,
    };
  };

  for (const file of markdownFiles) {
    const cache = app.metadataCache.getFileCache(file);
    const frontmatter = cache?.frontmatter;
    if (!frontmatter || frontmatter.tags === undefined) {
      continue;
    }

    const analysis = analyzeTags(frontmatter.tags);
    if (!analysis.needsLowercase && !analysis.needsSortingOrDedup) {
      continue;
    }

    await app.fileManager.processFrontMatter(file, (fm) => {
      const innerAnalysis = analyzeTags(fm.tags);
      const normalized = innerAnalysis.normalizedSortedUnique;
      fm.tags = [...normalized];
    });

    updatedCount += 1;
    console.log(`Normalized tags in ${file.path}`);
  }

  console.log(`Tag normalization complete. Updated ${updatedCount} file${updatedCount === 1 ? "" : "s"}.`);
};
