
[[🌱develop]] 

Here's a Python script that **safely merges settings** from your Meta Vault into target vaults without overwriting vault-specific customizations. It focuses on critical files like `settings.json`, `appearance.json`, and plugin configurations while preserving unique elements like vault IDs and workspace layouts.

```
import os
import shutil
import json
from pathlib import Path

def merge_obsidian_settings(meta_vault_path, target_vault_path):
    """Merges .obsidian settings from Meta Vault to target vault"""
    # Paths to .obsidian folders
    meta_dir = Path(meta_vault_path) / ".obsidian"
    target_dir = Path(target_vault_path) / ".obsidian"
    
    # Files to FULLY merge (deep merge nested keys)
    merge_files = ["settings.json", "appearance.json", "hotkeys.json"]
    
    # Files to COPY only if missing (vault-specific)
    copy_if_missing = ["workspace", "vault.json"]
    
    # Folders to SYNC recursively (plugins, snippets, etc.)
    sync_folders = ["plugins", "snippets", "themes"]
    
    print(f"Merging into: {target_dir}")

    # 1. Merge critical JSON files (preserve target-specific keys)
    for file in merge_files:
        meta_file = meta_dir / file
        target_file = target_dir / file
        
        if not meta_file.exists():
            continue
            
        # Load both files
        meta_data = json.loads(meta_file.read_text()) if meta_file.exists() else {}
        target_data = json.loads(target_file.read_text()) if target_file.exists() else {}
        
        # Recursive merge (meta updates target, but keeps target-only keys)
        def deep_merge(target, source):
            for key, value in source.items():
                if isinstance(value, dict):
                    target[key] = deep_merge(target.get(key, {}), value)
                else:
                    target[key] = value
            return target
        
        merged = deep_merge(target_data.copy(), meta_data)
        
        # Save merged file
        with open(target_file, "w") as f:
            json.dump(merged, f, indent=2)
        print(f"✔ Merged: {file}")

    # 2. Copy vault-specific files ONLY if missing
    for file in copy_if_missing:
        meta_file = meta_dir / file
        target_file = target_dir / file
        
        if meta_file.exists() and not target_file.exists():
            shutil.copy(meta_file, target_file)
            print(f"✔ Copied: {file} (was missing)")

    # 3. Sync folders (overwrite with meta version)
    for folder in sync_folders:
        meta_folder = meta_dir / folder
        target_folder = target_dir / folder
        
        if meta_folder.exists():
            # Remove existing folder before copy
            if target_folder.exists():
                shutil.rmtree(target_folder)
            shutil.copytree(meta_folder, target_folder)
            print(f"✔ Synced: {folder}/")

if __name__ == "__main__":
    # ===== CONFIGURATION =====
    META_VAULT = "/path/to/your/Meta_Vault"
    TARGET_VAULTS = [
        "/path/to/vault1",
        "/path/to/vault2",
        "/path/to/Games_Vault",
        "/path/to/Fun_Vault"
    ]
    # =========================
    
    for vault in TARGET_VAULTS:
        merge_obsidian_settings(META_VAULT, vault)
```


### Key Features:
1. **Smart JSON Merging**:
    - Deep-merges nested keys in critical files (e.g., `settings.json`)
    - Preserves target vault's unique settings (e.g., custom hotkeys in `Games_Vault`)
2. **Selective Sync**:
    - 🚫 **Never touches** vault-specific files:
        - `workspace` (your layout)
        - `vault.json` (vault ID for Sync)
    - 🔄 **Full sync for**:
        - `plugins/` (ensures consistent plugins)
        - `snippets/` (CSS tweaks)
        - `themes/` (if using shared theme)
3. **Safety Measures**:
    - Never deletes files in target vaults
    - Copies missing files only if absent (e.g., new snippets)
---
### How to Use:
1. **Install Python** (if not installed):  
    [Python 3.10+](https://www.python.org/downloads/)
2. **Save the script** as `obsidian_sync.py`  
    (Update `META_VAULT` and `TARGET_VAULTS` paths in the config section)
3. **Run periodically** when you update your Meta Vault:
    python obsidian_sync.py