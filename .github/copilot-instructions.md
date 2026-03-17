# Copilot Instructions

## Workflow expectations
- Track work through a GitHub issue whenever practical.
- Create one focused branch per issue.
- Open a pull request linked to the issue with `Closes #<issue-number>` when applicable.

## Labels
- Apply the closest existing repository label to new issues and pull requests.
- Mirror the linked issue label on the pull request when the same category applies.
- With the current label set, use:
  - `enhancement` for features, tooling upgrades, maintenance, and non-bug improvements
  - `bug` for regressions or broken behavior
  - `documentation` for docs-only work

## Branch naming
- Use `feat/<short-name>` for features.
- Use `fix/<short-name>` for bug fixes.
- Use `docs/<short-name>` for documentation work.
- Use `chore/<short-name>` for tooling, config, or maintenance.
- Use `refactor/<short-name>` for internal restructuring without user-facing behavior changes.

## Quality bar
- Run `bun run verify` before pushing when app code or configuration changes.
- Run `bun run test:e2e` when browser gameplay flow, Playwright config, or CI changes.
- Run `bun run build-storybook` when the design system or Storybook stories change.
