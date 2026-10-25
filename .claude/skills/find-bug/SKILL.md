---
name: find-bug
description: Systematic bug investigation for Lona (Expo + React Native + Expo Router). Reproduce, trace, isolate root cause, and propose fixes. Use when something is broken, the app crashes or red-screens, a screen/layout/animation misbehaves, Metro won't bundle, or a native build fails.
argument-hint: "description of the bug or error message"
---

# Find Bug: Investigate & Diagnose

A disciplined method for finding the root cause of a bug before changing code. Investigation first, fix second.

## Input

- `$ARGUMENTS` — the bug description, error message, or steps to reproduce. If blank, ask for it.

## Phase 1: Understand & Reproduce

1. **Restate the bug** in one line: expected vs. actual behaviour.
2. **Reproduce it.** Identify the exact steps, screen/route, platform (iOS / Android / web), and runtime (Expo Go, development build, simulator, physical device). Many bugs are platform-specific — check whether it reproduces on the other platform too.
3. **Capture evidence:** the exact error text + stack trace (red box / LogBox), the Metro terminal output, and (for visual bugs) the device, screen size, and what you see.

## Phase 2: Classify

| Symptom                                               | Likely area                                                                                                  |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Metro won't bundle / type error                       | TypeScript, imports, `app.json`, Babel/Metro config (`pnpm typecheck`)                                       |
| "Native module not found" / works in one runtime only | Library needs a development build — not in Expo Go; config plugin missing in `app.json`                      |
| Version / dependency mismatch warnings                | Package not SDK-compatible — `npx expo-doctor`, `npx expo install --fix`                                     |
| Hook error ("invalid hook call")                      | Hook called conditionally or outside a component/hook; duplicate React copies                                |
| Blank / crashed screen                                | Unguarded null/empty data, thrown error (check route `ErrorBoundary`), missing `_layout.tsx` export          |
| Navigation / routing wrong                            | File placement in `src/app/`, `_layout.tsx` navigator config, `Link`/`router` params, `useLocalSearchParams` |
| Layout differs per platform / notch overlap           | Flexbox defaults, `Platform.select`, missing safe-area handling (`react-native-safe-area-context`)           |
| Keyboard covers input                                 | Missing keyboard avoidance / scroll handling                                                                 |
| Animation / gesture glitch                            | Reanimated worklets, shared values read on the JS thread, gesture-handler root missing, reduced motion       |
| Janky lists / slow screen                             | Unvirtualised long lists, inline closures/objects re-rendering rows, heavy work on the JS thread             |
| Money amount wrong                                    | Floating-point math on currency, rounding, locale formatting — see `rules/code-quality.md`                   |

## Phase 3: Trace the Data/Render Path

Follow the flow from input to broken output and find the break point:

```
Route (src/app/**/*.tsx, _layout.tsx navigator)
  → Screen component (params, state, effects, handlers)
  → Hook (src/hooks/)
  → Pure logic / API client (src/lib/ or equivalent)
  → Native module / platform API
```

- Check the assumptions first — the bug is usually in what you assumed was working.
- Add temporary `console.log` at the suspected boundary (shows in the Metro terminal), or use the React Native DevTools (`j` in the Expo CLI) to inspect components, console, and network.
- Narrow it down: comment out / isolate the smallest piece that still reproduces the bug.
- Before blaming an Expo API, read the versioned docs for the SDK in `package.json` (see `AGENTS.md`) — APIs change between SDKs.

## Phase 4: Root Cause

State the root cause in one or two sentences — the actual reason, not the symptom. If you can't name it, keep tracing. Distinguish:

- **Root cause** — why it breaks (e.g. "the AppState listener is never removed, so it fires after the screen unmounts").
- **Symptom** — what the user sees ("balance flickers after navigating back").

Fix at the root, not the symptom. No band-aids.

## Phase 5: Report

```markdown
## Bug Report: [one-line title]

**Severity:** Critical | High | Medium | Low
**Area:** [route/component/file]
**Platforms affected:** iOS | Android | web

### Reproduction

[Exact steps, device/simulator, runtime (Expo Go / dev build)]

### Root Cause

[The real reason, with `file:line` references]

### Evidence

[Error text / stack / Metro output / screenshot notes]

### Proposed Fix(es)

1. [Option A — recommended, why]
2. [Option B — trade-off]

### Verification Plan

- [ ] Reproduction is now resolved on every affected platform
- [ ] `pnpm typecheck` passes
- [ ] `pnpm lint` passes
- [ ] No new LogBox warnings / errors
```

Per the project workflow preference: **present fix options and let the user choose before implementing**, unless they've asked you to just fix it.
