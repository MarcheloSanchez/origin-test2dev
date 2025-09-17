# `find_orphan_attachments.js`

## Purpose
This Node.js utility scans the Obsidian vault for attachment files that are not referenced by any Markdown note. It is intended for quick cleanup of stale images or other assets that are consuming storage but are no longer used.

## How it works
- Determines the vault root by walking upward from the script directory until it finds either a `.obsidian/` or `.git/` folder.
- Reads `.obsidian/app.json` to honor the configured **Attachment folder**. If the configuration is missing, attachments are assumed to live in `99-System/Images`.
- Recursively indexes every file in the attachment folder and tracks each filename, both by its full relative path and by basename for convenient matching.
- Walks every Markdown note in the vault (excluding common system folders such as `.git`, `.obsidian`, and `node_modules`) and parses:
  - Obsidian embeds (`![[attachment.png]]`)
  - Standard wikilinks (`[[attachment.png]]`)
  - Markdown image links (`![alt text](99-System/Images/attachment.png)` or relative links)
- Marks attachments as referenced when they appear in the note content. Anything left unreferenced at the end of the scan is reported as an orphan.

## Parameters
The script does not accept command-line arguments. Its behaviour can be influenced via vault configuration:
- **Attachment directory** – controlled through Obsidian’s `app.json` (`attachmentFolderPath`). The default falls back to `99-System/Images` if the setting is absent. Both relative and absolute folder values are supported.

## Prerequisites
- Node.js 16 or newer available on the command line.
- The script must be executed from within the vault repository so it can resolve the root directory and Obsidian configuration.

## Running the script
From the repository root:

```bash
node 99-System/Scripts/find_orphan_attachments.js
```

The script can also be made executable and run directly:

```bash
chmod +x 99-System/Scripts/find_orphan_attachments.js
./99-System/Scripts/find_orphan_attachments.js
```

## Output
The command prints a short summary followed by an optional list of orphaned files:

```
Attachment directory: /absolute/path/to/99-System/Images
Total attachments: 123
Referenced attachments: 117
Orphaned attachments: 6
Orphaned files:
 - 99-System/Images/example.png
 - 99-System/Images/unused-diagram.svg
```

Use the reported relative paths to review or delete the unreferenced files from the vault.
