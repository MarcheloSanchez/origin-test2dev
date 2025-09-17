const fs = require("fs");
const path = require("path");
const assert = require("assert");

const { createMockApp } = require("./support/mock_obsidian");
const deleteEmptyInbox = require("../Scripts/delete_empty_inbox.js");

async function main() {
  const vaultRoot = path.resolve(__dirname, "_sandbox", "inbox");
  const { app, Notice } = createMockApp(vaultRoot, () => {});

  const params = {
    targetsInclude: ["00-Inbox"],
    targetsExclude: ["00-Inbox/_pinned", "01-MOCs", "03-Efforts"],
    mode: "dry-run",
    backups: true,
    logPath: "../../logs/delete_empty_inbox-DRYRUN.md",
    emitNotice: false
  };

  const logPathAbs = path.resolve(vaultRoot, params.logPath);
  if (fs.existsSync(logPathAbs)) {
    fs.unlinkSync(logPathAbs);
  }

  const result = await deleteEmptyInbox(params, { app, Notice });

  const flaggedPaths = result.candidates.map(entry => entry.path).sort();
  assert.deepStrictEqual(flaggedPaths, ["00-Inbox/Untitled 1.md", "00-Inbox/empty.md"],
    "Only empty inbox files should be flagged.");

  assert.strictEqual(result.deleted.length, 0, "Dry run should not delete files.");

  const noteExists = fs.existsSync(path.join(vaultRoot, "00-Inbox", "note_with_text.md"));
  assert.ok(noteExists, "Non-empty note should remain.");

  const pinnedExists = fs.existsSync(path.join(vaultRoot, "00-Inbox", "_pinned", "pinned.md"));
  assert.ok(pinnedExists, "Excluded pinned file should remain untouched.");

  assert.ok(fs.existsSync(logPathAbs), "Log file should be generated.");
  const logContent = fs.readFileSync(logPathAbs, "utf8");
  assert.ok(/00-Inbox\/empty\.md/.test(logContent), "Log should list empty.md");
  assert.ok(/00-Inbox\/Untitled 1\.md/.test(logContent), "Log should list Untitled 1.md");
  assert.ok(/Candidates flagged: 2/.test(logContent), "Log should summarise candidate count.");

  console.log("delete_empty_inbox dry-run test passed.");
}

main().catch(error => {
  console.error("Test failed:", error);
  process.exit(1);
});
