# CODEX.md — Rules for this repo (read first)

## Goal
This repo is a static website deployed on Vercel. Keep changes minimal, predictable, and reviewable.

## Hard rules (must follow)
1. ONLY modify files explicitly requested by the user for the current task.
2. Do NOT add frameworks, build steps, dependencies, or package managers.
3. Do NOT reorganize folders, rename files, or change URLs unless asked.
4. Avoid reformatting unrelated code. Keep diffs small.
5. Do NOT invent content (e.g., activity MET lists) when the user says it will be provided later.
6. Preserve existing file naming and casing. Vercel is case-sensitive.
7. Never touch secrets/keys. Do not create env files.

## Repo conventions
- Static pages live as folders with their own index.html (e.g., /calburner/index.html → /calburner)
- Use relative paths within a page folder: ./styles.css, ./app.js
- Prefer vanilla JS (no libraries) for calculators and UI.

## Workflow for every change
1. Read the current files.
2. Identify the smallest change that satisfies the request.
3. Implement changes.
4. Self-check:
   - JS loads (no console errors)
   - CSS loads
   - UI updates on input change
   - No broken relative paths
5. Provide a short diff summary: files changed + what changed + why.

## Output format
- Summarize changes per file.
- If behavior changed, describe how to verify it.