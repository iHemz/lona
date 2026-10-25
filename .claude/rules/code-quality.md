# Code Quality

Principles for clean, readable, maintainable code in Lona (Expo + React Native + Expo Router + TypeScript). Favour clarity over cleverness — and correctness above all, because this app tracks money between friends.

---

## 1. Reuse Before Create

Before adding a new component, hook, or util, search for an existing one that already does ~80% of the job and extend it. Two implementations of the same thing is the most common source of drift.

- Routes only in `src/app/`. Shared components in `src/components/`, hooks in `src/hooks/`, pure logic and clients in a non-route folder (e.g. `src/lib/`).
- One-off, screen-specific pieces live next to the screen's components, not in `src/app/`.
- If you copy-paste a block more than once, extract it.

## 2. Pure Functions for Logic

Any logic that doesn't touch React state, native APIs, or I/O should be a plain function with no side effects — easy to read and trivial to test later.

```ts
// Prefer: pure derivation, no component coupling
export function outstandingBalance(loan: Loan): number {
  return loan.principalMinor - loan.repaidMinor;
}
```

Keep components focused on rendering; push branching/formatting/derivation into small named functions.

## 3. Money Is Exact

- Store and compute amounts as **integer minor units** (e.g. kobo/cents), never floating-point currency math.
- Keep the currency alongside the amount; don't assume a single currency.
- Format for display only at the edge, with `Intl.NumberFormat` (or equivalent), never by string concatenation.
- Any change touching balances, repayments, or settlement must handle partial, zero, and over-payment cases explicitly.

## 4. Composition Over Inheritance

Build UIs by composing small components and hooks, not by deep prop-drilling or god-components. If a component grows past ~150 lines or handles several unrelated concerns, split it.

## 5. Self-Documenting Names

- Components: `PascalCase` (`LoanCard`, `SettleUpSheet`).
- Hooks: `useCamelCase` and must start with `use`.
- Functions/variables: `camelCase`, named for intent (`isOverdue`, not `flag`).
- Delete a comment if a better name makes it redundant.

## 6. No Premature Abstraction

Build the concrete thing first. Extract a shared abstraction on the second real use, generalise on the third. Don't add config options, generics, or layers for hypothetical future needs.

## 7. TypeScript Honestly

- `tsconfig` is `strict` — keep it green (`pnpm typecheck`).
- Avoid `any`. Type props explicitly; type route params from `useLocalSearchParams`.
- Let types be inferred where obvious; annotate public function signatures and component props.

## 8. Mobile Reliability

- Guard against null/empty data, loading, and offline states — don't assume content or network exists.
- Clean up subscriptions, timers, `AppState`/`Keyboard` listeners in `useEffect` returns.
- Use `Platform.OS` / `Platform.select` or `.ios.tsx` / `.android.tsx` / `.web.tsx` files for platform differences — keep branching out of render bodies where possible.
- Never store secrets or tokens in plain storage or source; use `expo-secure-store` for sensitive values.
- Check the Expo versioned docs before using any Expo API (see `AGENTS.md`).

---

## Quality Checklist

Before finishing a change:

- [ ] Reused/extended existing components instead of duplicating
- [ ] Logic without I/O extracted into pure, well-named functions
- [ ] Money handled in integer minor units; edge cases covered
- [ ] No `any`; `pnpm typecheck` passes
- [ ] `pnpm lint` passes
- [ ] Effects clean up after themselves; loading/empty/error states handled
- [ ] Checked on iOS and Android (and web if affected)
- [ ] Accessibility & motion preferences respected (see `styling.md`)
