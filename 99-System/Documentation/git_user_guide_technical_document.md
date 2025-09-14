# Git User Guide (Technical Document)

## 1) Overview

### Purpose

- Give you a practical, reliable Git workflow for day‑to‑day development, code review, and release management.
- Help you diagnose and fix common issues quickly.
- Provide a compact reference of essential commands and parameters.

### Prerequisites

- **Git installed:** `git --version` → install from git-scm.com if missing.
- **Editor configured:** VS Code or your IDE; ensure it picks up the repo root.
- **Identity set:**
  ```bash
  git config --global user.name  "Your Name"
  git config --global user.email "you@example.com"
  git config --global init.defaultBranch main
  ```
- **Transport:**
  - **SSH** (recommended for frequent pushes): create key and add to host (GitHub/Azure DevOps/GitLab).
  - **HTTPS**: use a credential helper or Personal Access Token (PAT).

### Key Concepts

- **Repository (repo):** A project’s versioned directory (local + optional remotes).
- **Working tree / Index (Staging) / HEAD:**
  - *Working tree* = files on disk; *Index* = what will be committed; *HEAD* = your current checkout.
- **Commit:** Immutable snapshot with message & parents; forms a DAG.
- **Branch:** Movable pointer to a commit (e.g., `main`, `feature/x`).
- **Remote & tracking branch:** `origin/main` is your local view of the remote branch.
- **Merge vs Rebase:** Merge preserves branches; Rebase rewrites your branch onto another tip (clean history).
- **Fast‑forward:** Update a branch pointer without a merge commit when histories are linear.
- **Detached HEAD:** HEAD points directly to a commit (not a branch); changes risk being lost if not saved.
- **Tag:** Named pointer (often for releases), e.g., `v1.4.0`.

---

## 2) Step‑by‑Step Guide

### 2.1 First‑time Setup

```bash
# Identity & safety defaults
git config --global user.name  "Your Name"
git config --global user.email "you@example.com"
git config --global init.defaultBranch main
# Safer, predictable pulls
git config --global pull.ff only
# Prefer rebase when pulling topic branches (optional)
git config --global rebase.autoStash true
# Line endings (Windows): keep LF in repo, convert to CRLF in working tree
# Use 'input' on macOS/Linux
git config --global core.autocrlf true   # (Windows)
```

### 2.2 Create or Clone a Repository

```bash
# Start a new repo
mkdir demo && cd demo
git init
# Add a .gitignore before first commit when possible

# Or clone an existing repo
git clone git@host:org/repo.git
cd repo
```

### 2.3 Daily Workflow (Feature Branch + Pull Request)

```bash
# Start from updated main
git checkout main
git fetch origin
git pull --ff-only

# Create a feature branch
git switch -c feature/awesome

# Work and commit in small, focused steps
git status
git add path/to/file1 path/to/file2
git commit -m "feat: add awesome thing"

# Sync main into your branch (keeps PR small)
git fetch origin
git rebase origin/main   # or: git merge origin/main

# Push and open a PR
git push -u origin feature/awesome
```

**Common issues while rebasing**

```bash
# If conflicts appear
# 1) Resolve conflicts in editor
git add <conflicted-files>
# 2) Continue
git rebase --continue
# 3) Abort if needed
git rebase --abort
```

### 2.4 Review & Merge

- Prefer **Squash merge** for small feature branches (one clean commit).
- Prefer **Merge commit** for larger features preserved as a group.
- Use **Rebase & merge** only when you understand rewrite implications.

After merge:

```bash
git checkout main
git fetch origin
git pull --ff-only
# Remove merged branch locally & remotely
git branch -d feature/awesome
git push origin --delete feature/awesome
```

### 2.5 Undo & Repair (Safe to Dangerous)

```bash
# 1) Unstage but keep changes
git restore --staged <file>

# 2) Discard local changes in a file (cannot undo easily)
git restore <file>

# 3) New commit that reverts a previous one (safe for shared branches)
git revert <commit>

# 4) Move branch pointer (careful)
# --soft keeps index & working tree; --mixed resets index; --hard discards all
git reset --soft <commit>
git reset --mixed <commit>
git reset --hard <commit>

# 5) Find lost commits
git reflog
```

### 2.6 Stashing Work in Progress

```bash
git stash push -m "WIP login refactor"
# List / apply / drop
git stash list
git stash apply stash@{0}
git stash drop stash@{0}
```

### 2.7 Tags & Releases

```bash
# Lightweight tag
git tag v1.4.0
# Annotated tag (preferred for releases)
git tag -a v1.4.0 -m "Release 1.4.0"
# Push tags
git push origin --tags
```

### 2.8 Investigate History

```bash
# Compact log
git log --oneline --graph --decorate --all
# Diffs and blame
git diff HEAD~1..HEAD
git blame path/to/file
```

### 2.9 Bisect to Find a Regressor

```bash
git bisect start
git bisect bad              # current commit is bad
git bisect good <good-hash> # or a known good tag/commit
# Test each checkout, then mark
git bisect good|bad
# When done
git bisect reset
```

### 2.10 Working with Remotes

```bash
# Add another remote
git remote add upstream git@host:org/repo.git
# Update remote-tracking branches
git fetch --prune upstream
# Set upstream tracking for current branch
git push -u origin HEAD
```

### 2.11 Large Files & Ignores

```bash
# .gitignore example
# OS/IDE noise
.DS_Store
Thumbs.db
.vscode/
.idea/
# Build
/dist/
/node_modules/
*.log
```

> For truly large binaries, consider **Git LFS**.

### 2.12 Hooks (Basics)

- Client-side: `pre-commit` (lint/tests), `commit-msg` (message format), `pre-push` (run smoke tests).
- Managed via tools like **Husky** (JS), **pre-commit** (Python), or custom scripts.

---

## 3) Reference Section

### 3.1 Command Reference (Essentials)

- **Repository**
  - `git init` — create repo
  - `git clone <url>` — clone remote
  - `git remote -v` / `git remote add <name> <url>`
- **Status & Staging**
  - `git status` — what changed
  - `git add <path>` / `git restore --staged <path>`
  - `git restore <path>` — discard local changes
- **Committing**
  - `git commit -m "msg"` — create commit
  - `git commit --amend` — edit last commit (before push)
- **Branching & Switching**
  - `git branch` / `git branch -d <name>`
  - `git switch -c <name>` / `git switch <name>`
- **Sync**
  - `git fetch [--prune] [remote]`
  - `git pull --ff-only` or `git pull --rebase`
  - `git push [-u] [remote] [branch]`
  - `git push --force-with-lease` (rewrite safely on your branch)
- **Integration**
  - `git merge <branch>` — merge into current
  - `git rebase <base>` — replay commits on top of base
  - `git cherry-pick <commit>` — copy a commit
- **History**
  - `git log --oneline --graph --decorate --all`
  - `git show <commit>` — see a commit
  - `git diff [range]` — changes
  - `git blame <file>` — last change per line
- **Safety nets**
  - `git stash [push -m "msg"]`
  - `git reflog` — find lost commits
  - `git revert <commit>` — safe undo
  - `git reset [--soft|--mixed|--hard] <commit>` — move branch pointer
- **Cleanup**
  - `git clean -fd` — delete untracked files/dirs (danger)
- **Tagging**
  - `git tag [-a] vX.Y.Z [-m msg]`
  - `git push origin --tags`
- **Debugging**
  - `git bisect` — binary search for bad commit

### 3.2 Useful Parameters & Options

- `git log --since "2 weeks ago" --author="Alice" -- path/to/file`
- `git diff --name-only` (just file names)
- `git merge --no-ff` (force a merge commit)
- `git rebase --autostash` (save/restore local changes)
- `git push --set-upstream origin <branch>` (first push)
- `git pull --rebase --autostash` (linear pulls)
- `git reset --soft|--mixed|--hard` (levels of undo)
- `git tag -a v1.2.3 -m "Release"` (annotated tag)

### 3.3 Recommended Global Config (Copy‑Paste)

```bash
git config --global init.defaultBranch main
git config --global pull.ff only
git config --global rebase.autoStash true
# Windows only:
git config --global core.autocrlf true
# Safer force pushes on your branches
git config --global push.default simple
```

### 3.4 Practical Examples

**A) From zero to first PR**

```bash
# clone & branch
git clone git@host:org/repo.git
cd repo
git switch -c feature/add-login
# work
git add .
git commit -m "feat(auth): add basic login form"
# sync & publish
git fetch origin
git rebase origin/main
git push -u origin feature/add-login
# open PR in your host (GitHub/Ado/GitLab UI)
```

**B) Update your branch after review**

```bash
git fetch origin
git rebase origin/main
# fix review, amend if small
git commit --amend
# push rewritten history safely
git push --force-with-lease
```

**C) Release with tag**

```bash
git checkout main
git pull --ff-only
# bump version in code, commit via PR, then tag
git tag -a v1.5.0 -m "Release 1.5.0"
git push origin v1.5.0
```

**D) Quick bug fix from a known good point**

```bash
# create hotfix branch from latest production tag
git checkout -b hotfix/urgent v1.4.0
# implement & commit
# open PR, merge, tag v1.4.1
```

### 3.5 Common Problems & Fixes

- **Non‑fast‑forward push rejected** → `git fetch origin && git rebase origin/<branch> && git push` (or merge).
- **Merge/Rebase conflicts** → resolve files, `git add`, then `git merge --continue` or `git rebase --continue`.
- **Detached HEAD** → create a branch before you lose work: `git switch -c rescue/keep-this`.
- **Wrong commit message** (unpushed) → `git commit --amend`.
- **Wrong files staged** → `git restore --staged <file>`.
- **Accidentally deleted local changes** → try `git reflog`, then `git reset --hard <rehash>`.
- **CRLF/LF noise on Windows** → ensure `core.autocrlf=true` and `.gitattributes` for critical files.

### 3.6 Best Practices

- Small, cohesive commits; write **imperative messages** (optionally use Conventional Commits).
- Always **sync **`` before branching and before opening a PR.
- Prefer `` on `main`; avoid merge commits there.
- Never **force‑push** shared branches; use `--force-with-lease` on your own feature branches.
- Keep secrets out of Git; add sensitive files to `.gitignore` and use vaults.
- Automate checks with **pre‑commit hooks/CI**.
- Tag releases and maintain a CHANGELOG.

---

## 4) Quick Cheat Sheet (1‑Minute)

```bash
# Create work
git switch -c feature/x
# Stage & commit
git add -A && git commit -m "feat: x"
# Sync with main
git fetch origin && git rebase origin/main
# Publish
git push -u origin HEAD
# Update local main
git checkout main && git pull --ff-only
# Undo safely
git revert <hash>        # shared branch
# Find lost work
git reflog
# Release
git tag -a vX.Y.Z -m "Release" && git push origin --tags
```

---

## 5) Appendix: `.gitattributes` for Line Endings (Optional)

```gitattributes
# Enforce LF in repo for text files
* text=auto
# Keep shell scripts executable
*.sh text eol=lf
```

*End of document.*

