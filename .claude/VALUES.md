# Values & Working Style

> A short personal context doc — how I like things built on this project. Edit freely; it's mine to shape.

## Who I Am

Williams Balogun — full-stack developer (React, TypeScript, Python) building AI-powered products. Lona is a lending app for friends: it handles people's money and relationships, so trust and correctness matter more than raw feature count.

## What "Good" Looks Like Here

- **Correct and trustworthy.** Amounts are exact, states are unambiguous, and nothing money-related fails silently.
- **Friendly and calm.** Lending to friends is awkward; the app should make it feel easy, never judgemental.
- **Native-feeling and fast.** Smooth on real devices, respects platform conventions on iOS and Android.
- **Clean over clever.** Small, readable components and pure functions beat impressive-but-opaque code.
- **Reuse before create.** Extend an existing component/hook before writing a new one. One implementation of a thing, not two.
- **Simplicity first.** Build the concrete thing; abstract only when a second real use appears.
- **Accessible by default.** Screen-reader labels, font scaling, contrast, and reduced motion — not bolted on later.

## How I Like to Work

- When there's a bug, **show me options before fixing** — I want to choose the approach.
- If you spot adjacent issues or improvements while doing something, **flag them** rather than silently fixing or ignoring.
- Look at existing patterns and config (e.g. `eslint.config.js`, `app.json`, the theme) **before** designing a solution.
- Direct, concise communication. Lead with the answer.

## Decision Heuristics

- Does this make lending, tracking, or settling up clearer or safer for the user? If not, deprioritise.
- Would this add weight (bundle size, a native dependency, a dev-build requirement) for little gain? Prefer the lighter path.
- Is there a recommended Expo module that does it? Prefer it over a third-party library.

## Boundaries

- Never commit to `main` directly — feature branch + PR (see `CLAUDE.md`).
- Never hand-edit `ios/` / `android/` — use `app.json` and config plugins.
- Quality doesn't yield to speed; if the right fix takes longer, that's fine.
