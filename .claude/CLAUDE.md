# Lona — Project Instructions

**Lona** is a friendly lending app: users lend money to friends, see what's owed, and settle up through the platform. Expo / React Native for iOS, Android, and web. Expo-specific rules live in `AGENTS.md` at the repo root — read it first.

## Quick Reference

- **Package Manager:** pnpm (add deps with `npx expo install <package>`)
- **Dev Server:** `pnpm start` · `pnpm ios` / `pnpm android` / `pnpm web`
- **Type check:** `pnpm typecheck`
- **Lint:** `pnpm lint` · **Format:** `pnpm format` / `pnpm format:check`
- **Tech Stack:** Expo SDK 58, React Native, Expo Router, React 19, TypeScript (strict), Reanimated, Gesture Handler, ESLint + Prettier

## Project Structure

- `src/app/` — Expo Router routes only (every file is a screen; `_layout.tsx` defines navigators).
- `src/components/`, `src/hooks/`, `src/lib/` — non-route code (create as needed).
- `assets/` — static assets. `app.json` — app and native config (no hand-edited `ios/` / `android/`).

## Conventions (auto-loaded rules)

See `.claude/rules/`:

- `code-quality.md` — clean, testable code; reuse before create; exact money handling; mobile reliability.
- `styling.md` — theme tokens, layout, lists, interactions, accessibility & motion.
- `project-constraints.md` — tooling and commands.
- `workflow.md` — how I like to work + commit/branch conventions.

## Git Workflow

**NEVER commit or push directly to `main`.** All changes go through a feature branch and PR:

1. Check the branch (`git branch --show-current`). If on `main`, create one: `git checkout -b <type>/<description>`.
2. Use conventional commits — `type(scope): subject` — describing _what changed and why_ (see `workflow.md`). Never mention AI tooling in commit messages.
3. The `/commit` skill commits; `/ship` branches, commits, pushes, and opens the PR.

## Pre-PR Checklist

Before opening a PR, verify:

- [ ] `pnpm typecheck` passes
- [ ] `pnpm lint` passes
- [ ] `pnpm format:check` clean (or run `pnpm format`)
- [ ] `npx expo-doctor` clean if dependencies or `app.json` changed
- [ ] Verified in the running app on iOS and Android (and web if affected) — no LogBox errors or warnings
- [ ] Works on small and large screens, light and dark mode; accessible; respects reduced motion

There are no automated tests yet — verify changes by running the app.

## Helpers Available

- **Skills:** `/commit`, `/ship`, `/rebase`, `/resolve-conflicts`, `/checkout-main`, `/code-quality-review`, `/code-quality-review-pr`, `/find-bug`, `/refactor`, `/investigate`, `/agent-browser` (web build only), `/skill-creator`.
- **Agents:** `code-review` (review a diff), `ui-ux-expert` (design/UX review), `research-agent` (gather context).
