---
name: investigate
description: Pre-implementation feasibility research for Lona (Expo + React Native). Explores the codebase and the web to assess whether an idea is viable and how it'd fit, before any code is written. Use for "can we / how would we add X" questions.
argument-hint: "[idea or feature concept]"
---

# Investigate: Feasibility & Approach

Research an idea before building it. The output is a recommendation, not code.

## Input

- `$ARGUMENTS` — the idea or feature concept (e.g. "add push reminders for overdue loans", "add biometric unlock", "pay via bank transfer"). If blank, ask what to investigate.

## Method: Question → Explore → Recommend

### 1. Frame the questions

Turn the idea into 3–6 concrete questions, e.g.:

- Does anything similar already exist in the codebase?
- What would it touch (routes, components, hooks, `app.json`, config plugins, deps)?
- Is there an official Expo module for it? If not, is the third-party library SDK-compatible and maintained?
- Does it need native code — i.e. a development build instead of Expo Go?
- Does it behave differently on iOS / Android / web? Any store-review or permission implications?
- For anything touching money or personal data: what are the security, privacy, and compliance implications?
- What's the simplest version that delivers the value?

### 2. Explore

- **Codebase:** Glob/Grep and read relevant files in `src/app/`, `src/components/`, `src/hooks/`, `app.json`, `package.json`. Note existing patterns to reuse.
- **Web (when needed):** follow `AGENTS.md` — fetch the versioned Expo docs for the SDK in `package.json` and `https://docs.expo.dev/llms.txt`; never answer Expo questions from memory. Check library size, maintenance, and compatibility with the installed React Native / Expo SDK. Cite sources.

### 3. Recommend

Synthesise findings into a clear go / no-go with a suggested approach.

## Output Format

```markdown
# Investigation: [Idea]

## Verdict

[Feasible / Feasible with caveats / Not worth it] — one-line reason.

## What It Would Touch

| File / area | Change |
| ----------- | ------ |

## Approach (recommended)

[The simplest viable approach, reusing existing patterns and Expo modules where possible]

## Alternatives Considered

- [Option + trade-off]

## Risks & Considerations

- Native code / development build required?
- Platform differences (iOS / Android / web)
- Permissions, store review, privacy
- Security & correctness of money handling
- Performance / bundle size
- Maintenance & dependency cost

## Effort

[Rough sense: small / medium / large]

## Open Questions

[Anything that needs a decision before building]

## Sources

[Files read, URLs fetched]
```

## Boundaries

- Do NOT implement — this skill ends with a recommendation.
- Prefer the simplest approach that fits the app, and recommended Expo modules over third-party libraries.
- If the idea is clearly trivial, say so and point straight at the change rather than over-researching.
