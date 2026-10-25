# Project Constraints

- **Package manager:** `pnpm` (there's a `pnpm-lock.yaml` — do not use `npm`/`yarn`). Add dependencies with `npx expo install <package>` so versions match the Expo SDK.
- **Type check:** `pnpm typecheck` (`tsc --noEmit`, tsconfig is `strict`).
- **Lint:** `pnpm lint` (`expo lint` with `eslint-config-expo` + Prettier) · `pnpm lint:fix` to auto-fix.
- **Format:** `pnpm format` to write, `pnpm format:check` to verify (Prettier).
- **Dev server:** `pnpm start` (Expo CLI) · `pnpm ios` / `pnpm android` / `pnpm web` for a specific platform.
- **Health check:** `npx expo-doctor` for dependency/config issues; `npx expo install --fix` for SDK version mismatches.
- **Native folders:** `ios/` and `android/` are generated (CNG) and gitignored — configure native behaviour via `app.json` and config plugins only.
- **Terminal:** Windows. Both PowerShell and Git Bash are available; Unix-style commands work via Bash.
- There are no automated tests configured yet — verify changes by running the app.
