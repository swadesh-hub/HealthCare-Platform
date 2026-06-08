# 🌿 Git Branch Management & Workflow Policy

This document details the branching model, naming conventions, and merge workflows used in the **Healio Healthcare Platform** to ensure clean version control.

---

## 🗺️ 1. Git Branching Strategy (Git Flow)

We follow the industry-standard **Git Flow** strategy to coordinate development. The repository has two perpetual branches and several supporting branches.

```
master (production) ──────────────────────────────[ Tag v1.0.0 ]
                       ▲                    ▲
                       │ merge              │ merge
develop (integration) ─┴──────────┬─────────┴─────────────
                                  │          ▲
                       feature/   │ branch   │ merge
                       auth-flow  └──────────┘
```

### 🧱 Perpetual Branches
1. **`master` (or `main`)**:
   - Holds the production-ready code.
   - Every commit to `master` must be stable, tested, and tagged with a release version (e.g., `v1.0.0`).
2. **`develop`**:
   - The primary integration branch for active development.
   - Nightly builds and integration tests run against this branch.

### 🍃 Supporting Branches
1. **Feature Branches (`feature/` or `feat/`)**:
   - Used to develop new features.
   - Branched from: `develop`.
   - Merged back into: `develop` via Pull Request.
   - *Example:* `feature/auth-login-page`, `feature/report-trends`.
2. **Bugfix Branches (`bugfix/` or `fix/`)**:
   - Used to fix bugs found in development or staging.
   - Branched from: `develop`.
   - Merged back into: `develop`.
   - *Example:* `bugfix/pdf-ocr-leak`.
3. **Hotfix Branches (`hotfix/`)**:
   - Used to fix critical bugs in the live production branch (`master`).
   - Branched from: `master`.
   - Merged back into: both `master` and `develop`.
   - *Example:* `hotfix/session-expiry-crash`.

---

## 🏷️ 2. Naming Conventions

All commits and branch creations must follow standard patterns:

- **Branch Name Format:** `<type>/<issue-number>-<short-description>`
  - *Example:* `feature/102-authentication-logout`
  - *Example:* `bugfix/101-pdf-interpreter-crash`
- **Commit Message Format (Conventional Commits):**
  - `<type>(<scope>): <description>`
  - Types: `feat` (new feature), `fix` (bug fix), `docs` (documentation updates), `style` (formatting/UI), `refactor` (code reorganization), `test` (adding tests).
  - *Example:* `feat(auth): add login page with credentials validation`
  - *Example:* `fix(ocr): resolve patient record layout parse bug`

---

## 🤝 3. Merging & Pull Request (PR) Checklist

Before merging any code from a feature/bugfix branch into `develop` or `master`:
1. **Local Verification:**
   - Run linter checks: `npm run lint`.
   - Run production compilation checks: `npm run build`.
2. **PR Code Review:**
   - At least one developer must review code changes.
   - The PR must address a specific issue ticket.
3. **Merge Strategy:**
   - Always merge with `--no-ff` (no fast-forward) to preserve historical branch structures.
