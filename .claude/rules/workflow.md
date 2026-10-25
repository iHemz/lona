# Workflow Preferences

- Instead of fixing a bug right away, give me some options so I can choose before you fix them
- If you can find an opportunity to improve the output and reliability of the ask, then please suggest. Example: if I ask you to add a field, and you notice the existing fields have inconsistencies or potential bugs, flag them
- Analyse `eslint.config.js` and existing patterns before designing a solution, so we get the architecture right before writing code

## Git Commit Messages

- Commit messages describe **what changed and why** — never how it was built or what tools/processes were used
- Bad: `feat: added section through some skill/agent`
- Good: `feat(resume): add in-app PDF viewer with Google Drive proxy`
- Never mention AI agents, skills, or internal tooling in commit messages
- Focus on the user-facing or developer-facing value of the change
- Use conventional-commit style: `type(scope): subject` (see recent history)

## Git Branch Safety

- **NEVER commit directly to `main`.** All work goes on a feature branch and merges via PR
- If the current branch is `main`, create a new branch first — no exceptions
