/*
 * Reorder YAML fields in Obsidian
 * Keeps Base fields at the top
 * Usage in Templater: <%* tp.user.yaml_reorder() %>
 */

module.exports = async () => {
  const { app, workspace } = window;

  // Get current file
  const file = app.workspace.getActiveFile();
  if (!file) {
    console.log("No active file.");
    return;
  }

  // Read file content
  const content = await app.vault.read(file);

  // Define Base order
  const baseOrder = [
    "title",
    "type",
    "status",
    "tags",
    "created",
    "modified",
    "related"
  ];

  // Split YAML vs body
  const regex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(regex);
  if (!match) {
    console.log("No YAML frontmatter in file:", file.basename);
    return;
  }

  let yamlBlock = match[1];
  const body = match[2];

  // Parse simple key: value pairs
  let yamlObj = {};
  yamlBlock.split("\n").forEach(line => {
    if (!line.trim()) return;
    const idx = line.indexOf(":");
    if (idx === -1) return;
    const key = line.substring(0, idx).trim();
    const value = line.substring(idx + 1).trim();
    yamlObj[key] = value;
  });

  // Build reordered YAML
  let newYaml = "";

  // Base first
  baseOrder.forEach(key => {
    if (yamlObj.hasOwnProperty(key)) {
      newYaml += `${key}: ${yamlObj[key]}\n`;
      delete yamlObj[key];
    }
  });

  // Then remaining (alphabetical)
  Object.keys(yamlObj)
    .sort()
    .forEach(key => {
      newYaml += `${key}: ${yamlObj[key]}\n`;
    });

  // Reassemble
  const newContent = `---\n${newYaml}---\n${body}`;
  await app.vault.modify(file, newContent);

  console.log("YAML reordered successfully:", file.basename);
};
